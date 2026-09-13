// Decap CMS GitHub OAuth broker — Cloudflare Worker.
//
// Sits between the CMS (public/admin/) and GitHub's OAuth flow. GitHub's
// token exchange needs a client *secret*, which must never reach the
// browser — so this small server-side step does that exchange on the CMS's
// behalf. This is what public/admin/config.yml's `backend.base_url` points
// at. See README.md in this folder for one-time setup (creating the GitHub
// OAuth App and deploying this).
//
// Implements the two routes Decap's `backend: name: github` expects:
//   GET /auth      -- redirect to GitHub's own authorize page
//   GET /callback  -- exchange the returned code for a token, hand it back
//                     to the CMS popup via the postMessage handshake Decap
//                     documents for self-hosted OAuth providers.

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth') {
      const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
      authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
      authorizeUrl.searchParams.set('scope', 'repo,user');
      return Response.redirect(authorizeUrl.toString(), 302);
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing "code" query parameter.', { status: 400 });
      }

      const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        return new Response(`GitHub OAuth error: ${tokenData.error_description || tokenData.error}`, {
          status: 400,
        });
      }

      // Decap's documented handshake for a self-hosted OAuth provider: the
      // popup waits for any message from its opener (the CMS tab) as a
      // signal the opener is listening, then posts the real payload back.
      // JSON.stringify(message) below produces a safely-escaped JS string
      // literal for embedding -- not string concatenation into the script.
      const message = `authorization:github:success:${JSON.stringify({
        token: tokenData.access_token,
        provider: 'github',
      })}`;
      const html = `<!doctype html>
<html><body><script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(${JSON.stringify(message)}, e.origin);
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    return new Response('Not found. Expected /auth or /callback.', { status: 404 });
  },
};

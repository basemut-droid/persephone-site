# CMS OAuth broker — setup

This is the last piece needed before Marina can log into `/admin/` and edit the
site. Everything in this folder is written and ready; what's left are three
manual steps only you can do (a Cloudflare account, a GitHub OAuth App, and
pasting one URL back into `config.yml`).

## 1. Create a Cloudflare account (if you don't have one)

Free tier is enough for this. cloudflare.com → sign up.

## 2. Install Wrangler and deploy this worker

From this folder (`cms-oauth-worker/`):

```
npm install -g wrangler
wrangler login
wrangler deploy
```

`wrangler deploy` prints the worker's URL when it finishes, something like
`https://persephone-cms-oauth.<your-subdomain>.workers.dev`. **Copy that URL**
— you'll need it in step 4.

## 3. Create a GitHub OAuth App

GitHub → your profile picture → **Settings** → **Developer settings** →
**OAuth Apps** → **New OAuth App**. Fill in:

- **Application name**: anything, e.g. "Persephone CMS"
- **Homepage URL**: `https://persephone.at`
- **Authorization callback URL**: the worker URL from step 2, with `/callback`
  appended — e.g. `https://persephone-cms-oauth.<your-subdomain>.workers.dev/callback`

After creating it, GitHub shows a **Client ID** and lets you generate a
**Client Secret** — copy both.

## 4. Give the worker those two values, and finish wiring it up

Still in this folder:

```
wrangler secret put GITHUB_CLIENT_ID
```
(paste the Client ID when prompted, press enter)

```
wrangler secret put GITHUB_CLIENT_SECRET
```
(paste the Client Secret when prompted, press enter)

Then open `public/admin/config.yml` at the repo root and replace the
placeholder line:

```yaml
base_url: "https://REPLACE-WITH-YOUR-WORKER-URL.workers.dev"
```

with the real worker URL from step 2 (no trailing slash), commit, and push.

## 5. Test it

Visit `https://persephone.at/admin/` (or `https://neu.persephone.at/admin/`
while still staging). Click "Login with GitHub" — it should pop up a GitHub
authorize screen, then close itself and drop you into the CMS editor.

If it doesn't work, the most common cause is a mismatched callback URL —
double check step 3's callback URL is byte-for-byte the worker's URL plus
`/callback`, no typos, matching http vs https.

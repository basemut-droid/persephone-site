# CMS OAuth broker — setup

This is the last piece needed before Marina can log into `/admin/` and edit the
site. The broker itself is written and deployed automatically with everything
else (`public/cms-auth.php` + `public/cms-callback.php`) — what's left are
manual steps only you can do (a GitHub OAuth App, uploading one secrets file
by FTP, and a real login test). Replaces the earlier Cloudflare Worker plan
(`cms-oauth-worker/`, deleted) — see `docs/decisions.md`, 2026-09-15, for why.

## 1. Create a GitHub OAuth App

GitHub → your profile picture → **Settings** → **Developer settings** →
**OAuth Apps** → **New OAuth App**. Fill in:

- **Application name**: anything, e.g. "Persephone CMS"
- **Homepage URL**: `https://neu.persephone.at` while testing (swap to
  `https://persephone.at` once cutover has actually happened — see
  `HANDOFF.md`, this isn't that day yet)
- **Authorization callback URL**: `https://neu.persephone.at/cms-callback.php`
  — byte-for-byte, including `https://`; a mismatch here is the most common
  cause of a broken login

After creating it, GitHub shows a **Client ID** and lets you generate a
**Client Secret** — copy both, you'll need them in step 2.

## 2. Upload the secrets file, by hand, via FTP

Create (or edit the placeholder already in the repo, which is gitignored and
never committed) `public/cms-secrets.local.php` with the real values from
step 1:

```php
<?php
define('GITHUB_CLIENT_ID', 'paste the Client ID here');
define('GITHUB_CLIENT_SECRET', 'paste the Client Secret here');
```

Upload this one file via Web-FTP or an FTP client, next to the already-deployed
`cms-auth.php`/`cms-callback.php` in `neu.persephone.at`'s folder
(`apps/wordpress-180662/`). **Never** commit this file or push it through the
normal `git push` deploy — it's `.gitignore`'d specifically so that can't
happen by accident, since this repo is public.

## 3. Test it

Visit `https://neu.persephone.at/admin/` — note that subdomain currently has
Passwortschutz (HTTP Basic Auth) on it, which may prompt once per browser
session before the OAuth redirect can complete; that's expected, not a sign
anything is broken. Click "Login with GitHub" — it should pop up a GitHub
authorize screen, then close itself and drop you into the CMS editor.

If it doesn't work, the most common cause is a mismatched callback URL —
double-check step 1's callback URL is byte-for-byte
`https://neu.persephone.at/cms-callback.php`. A blank or error page from
`cms-callback.php` itself prints a plain-text reason (missing code, a GitHub
OAuth error, or the token exchange failing outright) rather than failing
silently.

## 4. Once cutover has happened (not today)

Update the GitHub OAuth App's Homepage URL and callback URL to the real
domain, and swap `public/admin/config.yml`'s `backend.base_url` from
`https://neu.persephone.at` to the real domain.

<?php
/**
 * Decap CMS GitHub OAuth broker -- Schritt 1: "/auth".
 *
 * GitHub braucht fuer den Token-Tausch ein Client Secret, das nie im
 * Browser landen darf -- deshalb macht dieses kleine serverseitige Skript
 * den Redirect zu GitHub, und cms-callback.php (siehe dort) den eigentlichen
 * Tausch. Ersetzt den fruehen Cloudflare-Worker-Plan (siehe
 * docs/decisions.md, 2026-09-15): gleiche Aufgabe, aber auf easyname statt
 * einem zusaetzlichen Anbieter, aus Konsistenz mit jeder anderen
 * Hosting-Entscheidung dieses Projekts.
 *
 * public/admin/config.yml's `backend.base_url` + `backend.auth_endpoint`
 * zeigen hierher.
 */

declare(strict_types=1);

require __DIR__ . '/cms-secrets.local.php';

$schema = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$redirectUri = $schema . '://' . $_SERVER['HTTP_HOST'] . '/cms-callback.php';

$authorizeUrl = 'https://github.com/login/oauth/authorize?' . http_build_query([
    'client_id' => GITHUB_CLIENT_ID,
    'redirect_uri' => $redirectUri,
    'scope' => 'repo,user',
]);

header('Location: ' . $authorizeUrl);
exit;

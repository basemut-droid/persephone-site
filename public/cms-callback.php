<?php
/**
 * Decap CMS GitHub OAuth broker -- Schritt 2: "/callback".
 *
 * cms-auth.php hat den Login-Popup zu GitHub geschickt; GitHub schickt den
 * Popup jetzt hierher zurueck, mit einem einmaligen `code` in der URL. Dieses
 * Skript tauscht den Code serverseitig (mit dem Client Secret, das nie in
 * den Browser darf) gegen ein echtes Access Token und reicht es per
 * `postMessage` an das oeffnende Tab (das eigentliche CMS-Fenster) weiter --
 * das genaue Handshake-Format ist von Decap selbst vorgegeben (nicht frei
 * gewaehlt), siehe
 * https://decapcms.org/docs/backends-overview/#implementing-a-custom-backend
 * und, fuer die vorherige Cloudflare-Worker-Fassung mit demselben Handshake,
 * Commit 26df2bd (cms-oauth-worker/worker.js, seither geloescht --
 * docs/decisions.md, 2026-09-15).
 */

declare(strict_types=1);

require __DIR__ . '/cms-secrets.local.php';

/**
 * POST an $url mit $params als JSON-Body, Antwort als JSON-Array zurueck.
 * Nutzt curl wenn vorhanden, sonst file_get_contents mit einem Stream-
 * Context als Fallback (nicht jeder easyname-Tarif hat die curl-Extension
 * aktiviert -- noch nicht gegen den echten Server getestet, siehe
 * HANDOFF.md).
 */
function post_json(string $url, array $params): array
{
    $body = json_encode($params, JSON_THROW_ON_ERROR);
    $headers = ['Content-Type: application/json', 'Accept: application/json'];

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
        ]);
        $response = curl_exec($ch);
        $fehler = curl_error($ch);
        curl_close($ch);
        if ($response === false) {
            throw new RuntimeException('curl-Anfrage an GitHub fehlgeschlagen: ' . $fehler);
        }
    } else {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => implode("\r\n", $headers),
                'content' => $body,
                'timeout' => 15,
                'ignore_errors' => true,
            ],
        ]);
        $response = file_get_contents($url, false, $context);
        if ($response === false) {
            throw new RuntimeException('file_get_contents-Anfrage an GitHub fehlgeschlagen.');
        }
    }

    $daten = json_decode($response, true);
    return is_array($daten) ? $daten : [];
}

// Kein ": never"-Rueckgabetyp (PHP 8.1+) -- welche PHP-Version easyname
// tatsaechlich ausliefert, ist noch nicht getestet (siehe HANDOFF.md).
function fehlerseite(string $nachricht): void
{
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    echo $nachricht;
    exit;
}

$code = $_GET['code'] ?? null;
if (!is_string($code) || $code === '') {
    fehlerseite('Fehlender "code"-Parameter -- Login-Versuch abgebrochen oder ungueltig.');
}

try {
    $tokenDaten = post_json('https://github.com/login/oauth/access_token', [
        'client_id' => GITHUB_CLIENT_ID,
        'client_secret' => GITHUB_CLIENT_SECRET,
        'code' => $code,
    ]);
} catch (RuntimeException $e) {
    fehlerseite('Token-Tausch mit GitHub fehlgeschlagen: ' . $e->getMessage());
}

if (isset($tokenDaten['error'])) {
    fehlerseite('GitHub OAuth-Fehler: ' . ($tokenDaten['error_description'] ?? $tokenDaten['error']));
}

if (!isset($tokenDaten['access_token']) || !is_string($tokenDaten['access_token'])) {
    fehlerseite('GitHub hat kein Access Token zurueckgegeben.');
}

// Das von Decap dokumentierte Handshake-Format fuer einen selbst gehosteten
// OAuth-Provider: Das Popup wartet auf eine beliebige Nachricht vom Opener
// (dem CMS-Tab) als Zeichen, dass der Opener zuhoert, und schickt dann die
// eigentliche Payload zurueck. json_encode() escaped "/" standardmaessig zu
// "\/", was auch verhindert, dass ein "</script>" im Token-String das
// Script-Tag vorzeitig schliessen koennte.
$message = 'authorization:github:success:' . json_encode([
    'token' => $tokenDaten['access_token'],
    'provider' => 'github',
], JSON_THROW_ON_ERROR);
$messageJs = json_encode($message, JSON_THROW_ON_ERROR);

header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html><body><script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(<?= $messageJs ?>, e.origin);
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>

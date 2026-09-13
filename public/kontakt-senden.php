<?php
/**
 * Kontaktformular -> E-Mail an Marina, ohne Drittanbieter.
 *
 * Ersetzt zwei zuvor erwogene Wege (Microsoft Forms: nimmt keine POSTs von
 * einem eigenen <form> entgegen, ist nur per Link/Embed nutzbar; web3forms:
 * verarbeitet die Nachricht auf US-Servern, siehe docs/decisions.md,
 * Hosting-Entscheidung 2026-09-13). Läuft direkt auf easyname (PHP, keine
 * Datenbank, kein externer Aufruf) und schickt jede Anfrage sofort weiter --
 * es wird nichts hier gespeichert.
 *
 * Voraussetzung: der SPF-Eintrag von persephone.at muss
 * "include:spf.easyname.com" enthalten, sonst landet die Mail bei Marina
 * im Spam oder wird abgewiesen (siehe docs/decisions.md).
 */

declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /kontakt/');
    exit;
}

$empfaenger = 'marinabletsas@persephone.at';

// Honeypot: fuer Menschen unsichtbares Feld (siehe ContactForm.astro). Ist
// es ausgefuellt, war es ein Bot -- wir tun so, als waere alles gut
// gegangen, ohne wirklich zu senden, damit der Bot nichts merkt.
if (!empty($_POST['website'])) {
    header('Location: /kontakt-danke/');
    exit;
}

/**
 * Entfernt Zeilenumbrueche aus Werten, die in Mail-Headern landen (Name,
 * E-Mail-Adresse) -- sonst koennte jemand ueber das Formular zusaetzliche
 * Header einschleusen (Header-Injection) und den Server fuer Spam
 * missbrauchen.
 */
function header_sicher(string $wert): string
{
    return trim(str_replace(["\r", "\n"], '', $wert));
}

$name = header_sicher((string) ($_POST['name'] ?? ''));
$email = header_sicher((string) ($_POST['email'] ?? ''));
$anliegenWert = (string) ($_POST['topic'] ?? '');
$nachricht = (string) ($_POST['message'] ?? '');
$zustimmung = isset($_POST['consent']);

// Muss mit den <option value="..."> in ContactForm.astro uebereinstimmen.
$anliegenLabels = [
    'frage' => 'Frage zu Persephone',
    'kooperation' => 'Kooperation & Presse',
    'sonstiges' => 'Sonstiges',
];
$anliegen = $anliegenLabels[$anliegenWert] ?? null;

// Serverseitiges Sicherheitsnetz -- normale Besucher:innen sehen das nie,
// weil required/type="email" im Formular schon im Browser greift (siehe
// die Live-Korrektur zu novalidate in ContactForm.astro). Das hier faengt
// nur absichtliche Umgehungen ab (z.B. ein direkter POST ohne Browser).
$gueltig = $name !== ''
    && filter_var($email, FILTER_VALIDATE_EMAIL) !== false
    && $anliegen !== null
    && $zustimmung;

if (!$gueltig) {
    header('Location: /kontakt/?fehler=1');
    exit;
}

$betreff = mb_encode_mimeheader('Kontaktformular: ' . $anliegen, 'UTF-8');
$text = "Name: {$name}\n"
    . "E-Mail: {$email}\n"
    . "Anliegen: {$anliegen}\n\n"
    . "Nachricht:\n{$nachricht}\n";

// Reply-To nur die Adresse, kein Anzeigename -- ein Name mit Komma oder
// spitzen Klammern wuerde sonst das Header-Format zerstoeren. Marina kann
// trotzdem einfach auf "Antworten" klicken.
$headers = [
    'From: Persephone Website <no-reply@persephone.at>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

$erfolg = mail($empfaenger, $betreff, $text, implode("\r\n", $headers));

header('Location: ' . ($erfolg ? '/kontakt-danke/' : '/kontakt/?fehler=1'));
exit;

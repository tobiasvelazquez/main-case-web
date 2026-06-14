<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function clean_header_value(string $value): string
{
    return trim(str_replace(["\r", "\n"], '', $value));
}

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

function starts_with(string $haystack, string $needle): bool
{
    return substr($haystack, 0, strlen($needle)) === $needle;
}

function ends_with(string $haystack, string $needle): bool
{
    if ($needle === '') {
        return true;
    }
    return substr($haystack, -strlen($needle)) === $needle;
}

function hash_ip(string $ip): string
{
    return hash('sha256', $ip . '|maincase_contact');
}

function check_rate_limit(string $ip): bool
{
    $now = time();
    $windowSeconds = 3600;
    $maxPerWindow = 20;
    $minSecondsBetween = 3;
    $dir = sys_get_temp_dir();
    $path = rtrim($dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'maincase_contact_' . hash_ip($ip) . '.json';
    $history = [];

    if (is_file($path)) {
        $raw = file_get_contents($path);
        if (is_string($raw) && $raw !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $history = array_values(array_filter($decoded, static fn ($ts) => is_int($ts) || ctype_digit((string) $ts)));
                $history = array_map('intval', $history);
            }
        }
    }

    $history = array_values(array_filter($history, static fn ($ts) => $ts > ($now - $windowSeconds)));
    sort($history);

    if (!empty($history)) {
        $last = (int) $history[count($history) - 1];
        if (($now - $last) < $minSecondsBetween) {
            return false;
        }
    }

    if (count($history) >= $maxPerWindow) {
        return false;
    }

    $history[] = $now;
    @file_put_contents($path, json_encode($history), LOCK_EX);
    return true;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'message' => 'Metodo no permitido.']);
}

$origin = trim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));
if ($origin !== '') {
    $originHost = (string) parse_url($origin, PHP_URL_HOST);
    $originHost = strtolower($originHost);
    $allowedOrigin = $originHost === 'localhost'
        || $originHost === '127.0.0.1'
        || ends_with($originHost, '.hachitec.com.ar')
        || $originHost === 'hachitec.com.ar';
    if (!$allowedOrigin) {
        respond(403, ['ok' => false, 'message' => 'Origen no permitido.']);
    }
}

$nombre = trim((string) ($_POST['nombre'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$motivo = trim((string) ($_POST['motivo'] ?? 'contacto'));
$mensaje = trim((string) ($_POST['mensaje'] ?? ''));
$website = trim((string) ($_POST['website'] ?? ''));
$elapsedMs = (int) ($_POST['elapsed_ms'] ?? 0);

$allowedMotivos = ['contacto', 'colaboracion', 'bug', 'feedback'];
$motivoLabels = [
    'contacto' => 'Contacto general',
    'colaboracion' => 'Colaboracion',
    'bug' => 'Reporte de bug',
    'feedback' => 'Feedback',
];

if ($nombre === '' || text_length($nombre) > 120) {
    respond(422, ['ok' => false, 'message' => 'Nombre invalido.']);
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'message' => 'Email invalido.']);
}

if (!in_array($motivo, $allowedMotivos, true)) {
    respond(422, ['ok' => false, 'message' => 'Motivo invalido.']);
}

if ($mensaje === '' || text_length($mensaje) < 10 || text_length($mensaje) > 4000) {
    respond(422, ['ok' => false, 'message' => 'Mensaje invalido.']);
}

if ($website !== '') {
    // Honeypot: no avisamos error para no dar pistas a bots.
    respond(200, ['ok' => true, 'message' => 'Mensaje enviado.']);
}

if ($elapsedMs > 0 && $elapsedMs < 1200) {
    respond(429, ['ok' => false, 'message' => 'Envio demasiado rapido.']);
}

$remoteIp = (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
if (!check_rate_limit($remoteIp)) {
    respond(429, ['ok' => false, 'message' => 'Demasiados intentos. Intenta nuevamente en unos minutos.']);
}

$attachment = null;
if (isset($_FILES['archivo']) && is_array($_FILES['archivo'])) {
    $fileError = (int) ($_FILES['archivo']['error'] ?? UPLOAD_ERR_NO_FILE);

    if ($fileError !== UPLOAD_ERR_NO_FILE) {
        if ($fileError !== UPLOAD_ERR_OK) {
            respond(422, ['ok' => false, 'message' => 'No se pudo procesar el archivo adjunto.']);
        }

        $maxBytes = 10 * 1024 * 1024;
        $size = (int) ($_FILES['archivo']['size'] ?? 0);
        if ($size <= 0 || $size > $maxBytes) {
            respond(422, ['ok' => false, 'message' => 'El adjunto supera el limite de 10 MB.']);
        }

        $tmpPath = (string) ($_FILES['archivo']['tmp_name'] ?? '');
        if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
            respond(422, ['ok' => false, 'message' => 'Adjunto invalido.']);
        }

        $originalName = basename((string) ($_FILES['archivo']['name'] ?? 'adjunto'));
        $safeName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName) ?: 'adjunto';
        $extension = strtolower(pathinfo($safeName, PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'zip', 'txt', 'log'];
        if (!in_array($extension, $allowedExtensions, true)) {
            respond(422, ['ok' => false, 'message' => 'Tipo de adjunto no permitido.']);
        }

        $mimeType = 'application/octet-stream';
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            if ($finfo !== false) {
                $detected = finfo_file($finfo, $tmpPath);
                if (is_string($detected) && $detected !== '') {
                    $mimeType = $detected;
                }
                finfo_close($finfo);
            }
        }

        $allowedMimes = [
            'application/pdf',
            'application/zip',
            'application/x-zip-compressed',
            'text/plain',
            'text/x-log',
        ];
        $isAllowedMime = starts_with($mimeType, 'image/') || in_array($mimeType, $allowedMimes, true);
        if (!$isAllowedMime) {
            respond(422, ['ok' => false, 'message' => 'Adjunto invalido.']);
        }

        $content = file_get_contents($tmpPath);
        if ($content === false) {
            respond(422, ['ok' => false, 'message' => 'No se pudo leer el adjunto.']);
        }

        $attachment = [
            'name' => $safeName,
            'mime' => $mimeType,
            'data' => $content,
        ];
    }
}

$to = getenv('CONTACT_TO') ?: 'maincase@hachitec.com.ar';
$from = getenv('CONTACT_FROM') ?: 'maincase@hachitec.com.ar';

$safeTo = clean_header_value($to);
$safeFrom = clean_header_value($from);
$safeReplyTo = clean_header_value($email);
$safeNombre = clean_header_value($nombre);
$motivoLabel = $motivoLabels[$motivo] ?? 'Contacto general';

$subject = '[Main Case] ' . $motivoLabel . ' - ' . $safeNombre;
$bodyText = "Nuevo mensaje desde el formulario de contacto\n\n"
    . "Nombre: {$safeNombre}\n"
    . "Email: {$safeReplyTo}\n"
    . "Motivo: {$motivoLabel}\n"
    . "Fecha: " . date('Y-m-d H:i:s') . "\n"
    . "IP: {$remoteIp}\n\n"
    . "Mensaje:\n{$mensaje}\n";

$headers = [];
$headers[] = "From: Main Case <{$safeFrom}>";
$headers[] = "Reply-To: {$safeReplyTo}";
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'X-Mailer: PHP/' . phpversion();

if ($attachment === null) {
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $mailBody = $bodyText;
} else {
    $boundary = '==Multipart_Boundary_x' . md5((string) microtime(true)) . 'x';
    $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';

    $mailBody = "--{$boundary}\r\n";
    $mailBody .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $mailBody .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $mailBody .= $bodyText . "\r\n\r\n";
    $mailBody .= "--{$boundary}\r\n";
    $mailBody .= 'Content-Type: ' . $attachment['mime'] . '; name="' . $attachment['name'] . '"' . "\r\n";
    $mailBody .= "Content-Transfer-Encoding: base64\r\n";
    $mailBody .= 'Content-Disposition: attachment; filename="' . $attachment['name'] . '"' . "\r\n\r\n";
    $mailBody .= chunk_split(base64_encode((string) $attachment['data'])) . "\r\n";
    $mailBody .= "--{$boundary}--";
}

$sent = mail($safeTo, $subject, $mailBody, implode("\r\n", $headers));

if (!$sent) {
    respond(500, ['ok' => false, 'message' => 'No se pudo enviar el mensaje.']);
}

respond(200, ['ok' => true, 'message' => 'Mensaje enviado.']);

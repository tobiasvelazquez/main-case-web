<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

$origin = trim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    $allowed = $originHost === 'localhost'
        || $originHost === '127.0.0.1'
        || $originHost === 'hachitec.com.ar'
        || substr($originHost, -strlen('.hachitec.com.ar')) === '.hachitec.com.ar';
    if (!$allowed) {
        http_response_code(403);
        echo json_encode(['ok' => false]);
        exit;
    }
}

$file = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'maincase_downloads.json';

function read_count(string $file): int
{
    if (!is_file($file)) return 0;
    $raw = file_get_contents($file);
    if ($raw === false) return 0;
    $data = json_decode($raw, true);
    return is_array($data) && isset($data['count']) ? (int) $data['count'] : 0;
}

function write_count(string $file, int $count): void
{
    file_put_contents($file, json_encode(['count' => $count]), LOCK_EX);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    $count = read_count($file) + 1;
    write_count($file, $count);
    echo json_encode(['ok' => true, 'count' => $count]);
    exit;
}

echo json_encode(['ok' => true, 'count' => read_count($file)]);

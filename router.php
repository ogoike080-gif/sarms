<?php
// ============================================================
// SARMS — router.php
// Entry point for PHP's built-in web server on Railway:
//   php -S 0.0.0.0:$PORT router.php
//
// Railway's Nixpacks setup has no Apache/nginx, so there's no
// .htaccess rewrite engine to route requests. This script is the
// equivalent: it dispatches /api/*.php to the real PHP scripts
// unchanged, serves the Vite-built frontend out of dist/, serves
// /uploads/ (assignment submissions etc.), and falls back to
// dist/index.html for client-side (React) routes.
// ============================================================

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// ── 1. API requests — run the real script from api/, unmodified ──
if (preg_match('#^/api/([A-Za-z0-9_\-]+\.php)$#', $uri, $m)) {
    $script = __DIR__ . '/api/' . $m[1];
    if (is_file($script)) {
        chdir(__DIR__ . '/api'); // so each script's own relative paths (jwt_secret.php etc.) still work
        require $script;
        return true;
    }
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'API script not found: ' . $m[1]]);
    return true;
}

// ── 2. Uploaded files (assignment submissions, images) ──
if (strpos($uri, '/uploads/') === 0) {
    $file = __DIR__ . $uri;
    if (is_file($file)) return false; // let the built-in server serve it as a static file
    http_response_code(404);
    return true;
}

// ── 3. Built frontend static assets (JS/CSS/images from `npm run build`) ──
$distFile = __DIR__ . '/dist' . $uri;
if ($uri !== '/' && is_file($distFile)) {
    $ext = strtolower(pathinfo($distFile, PATHINFO_EXTENSION));
    $mimes = [
        'js' => 'application/javascript', 'mjs' => 'application/javascript',
        'css' => 'text/css', 'html' => 'text/html; charset=utf-8',
        'json' => 'application/json', 'svg' => 'image/svg+xml',
        'png' => 'image/png', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
        'gif' => 'image/gif', 'webp' => 'image/webp', 'ico' => 'image/x-icon',
        'woff' => 'font/woff', 'woff2' => 'font/woff2', 'ttf' => 'font/ttf',
        'map' => 'application/json',
    ];
    if (isset($mimes[$ext])) header('Content-Type: ' . $mimes[$ext]);
    readfile($distFile);
    return true;
}

// ── 4. Everything else (client-side routes) — serve the built SPA shell ──
$index = __DIR__ . '/dist/index.html';
if (is_file($index)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($index);
} else {
    http_response_code(500);
    echo 'dist/index.html not found — did `npm run build` run before startup?';
}
return true;

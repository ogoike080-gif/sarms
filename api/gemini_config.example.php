<?php
// ============================================================
// api/gemini_config.example.php
//
// Copy this file to api/gemini_config.php and fill in a real key.
// gemini_config.php should NEVER be committed to version control
// or copied into a public web root without .htaccess protection —
// it holds a secret. api/ai.php reads getenv('GEMINI_API_KEY')
// FIRST and only falls back to this file if that's not set, so on
// a host where you can set real environment variables, prefer that
// instead (see BUILD_AND_INSTALL.md's "Gemini setup" section).
// ============================================================

return [
    'GEMINI_API_KEY' => 'your_api_key_here',
    'GEMINI_MODEL'   => 'gemini-3.1-flash-lite',
    'MAX_OUTPUT_TOKENS' => 800,
];

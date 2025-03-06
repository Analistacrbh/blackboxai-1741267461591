<?php
require_once __DIR__ . '/config/config.php';

$senha = 'admin123';
$hash = '$2y$10$8VyQ5A5T5IHGvXrDiF5P2.BzTQH/gQrWUHptDgRqxk3VXRW9Kj.Aq';

echo "Testing password verification:\n";
echo "Password: $senha\n";
echo "Hash: $hash\n";
echo "Verification result: " . (password_verify($senha, $hash) ? "TRUE" : "FALSE") . "\n";

// Create a new hash for comparison
$new_hash = password_hash($senha, PASSWORD_DEFAULT, ['cost' => HASH_COST]);
echo "\nNew hash generated: $new_hash\n";
echo "New hash verification: " . (password_verify($senha, $new_hash) ? "TRUE" : "FALSE") . "\n";

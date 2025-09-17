<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
header('Content-Type: application/json');
echo json_encode(['csrf_token' => $_SESSION['csrf_token']]);
?>
<?php
session_start();
require_once 'db_connect.php';

if (isset($_SESSION['user_id'])) {
    return;
}

if (isset($_COOKIE['remember_token'])) {
    try {
        $token = hash('sha256', $_COOKIE['remember_token']);
        $stmt = $pdo->prepare("SELECT id, username, email FROM users WHERE remember_token = :token");
        $stmt->execute([':token' => $token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            header('Location: /My%20Website/html/Home%20Page.html');
            exit;
        } else {
            setcookie('remember_token', '', time() - 3600, '/', '', false, true);
        }
    } catch (Exception $e) {
        error_log('Auto login error: ' . $e->getMessage());
        setcookie('remember_token', '', time() - 3600, '/', '', false, true);
    }
}
?>
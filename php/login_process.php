<?php
// Start output buffering
ob_start();
session_start();
header('Content-Type: application/json');

// Enable error logging
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

try {
    require_once __DIR__ . '/db_connect.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method.');
    }

    if (!isset($_POST['email'])) {
        throw new Exception('Email is required.');
    }

    $email = trim($_POST['email']);

    if (empty($email)) {
        throw new Exception('Email cannot be empty.');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format.');
    }

    // Check if user exists in MySQL
    $stmt = $pdo->prepare('SELECT id, username, email FROM users WHERE email = :email');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new Exception('User not found.');
    }

    // Store user data in session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $user['email'];

    ob_end_clean();
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    ob_end_clean();
    echo json_encode(['success' => false, 'error' => 'Database error']);
} catch (Exception $e) {
    error_log('General error: ' . $e->getMessage());
    ob_end_clean();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} catch (Throwable $e) {
    error_log('Unexpected error: ' . $e->getMessage());
    ob_end_clean();
    echo json_encode(['success' => false, 'error' => 'Unexpected server error']);
}
?>
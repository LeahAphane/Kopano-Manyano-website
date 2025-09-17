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

    if (!isset($_POST['username'], $_POST['email'], $_POST['password'], $_POST['terms'])) {
        throw new Exception('All fields are required.');
    }

    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $terms = $_POST['terms'] == 1 ? 1 : 0;

    if (empty($username) || empty($email) || empty($password)) {
        throw new Exception('Fields cannot be empty.');
    }
    if (strlen($username) < 3) {
        throw new Exception('Username must be at least 3 characters long.');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format.');
    }
    if (strlen($password) < 6) {
        throw new Exception('Password must be at least 6 characters long.');
    }
    if (!$terms) {
        throw new Exception('You must agree to the Terms of Service.');
    }

    // Check for existing username or email
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM users WHERE username = :username OR email = :email');
    $stmt->execute([':username' => $username, ':email' => $email]);
    if ($stmt->fetchColumn() > 0) {
        throw new Exception('Username or email already exists.');
    }

    // Insert user into MySQL
    $stmt = $pdo->prepare('INSERT INTO users (username, email, password) VALUES (:username, :email, :password)');
    $stmt->execute([
        ':username' => $username,
        ':email' => $email,
        ':password' => password_hash($password, PASSWORD_DEFAULT)
    ]);

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
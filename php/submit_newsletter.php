<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$host = 'localhost';
$dbname = 'kmgc_db';
$username = 'root';
$password = ''; // Use a strong password in production

$response = ['success' => false, 'message' => ''];

ini_set('display_errors', 0);
error_reporting(E_ALL);

$logDir = __DIR__ . '/../logs';
if (!file_exists($logDir)) {
    if (!mkdir($logDir, 0755, true) || !is_writable($logDir)) {
        $response['message'] = 'Cannot create or write to logs directory.';
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("Database connection successful", 3, "$logDir/db.log");

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method.');
    }

    if (!isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        error_log("CSRF validation failed: Received " . ($_POST['csrf_token'] ?? 'none') . ", Expected " . ($_SESSION['csrf_token'] ?? 'none'), 3, "$logDir/csrf.log");
        throw new Exception('Invalid CSRF token.');
    }

    error_log("Form data: " . print_r($_POST, true), 3, "$logDir/form.log");

    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);

    if (empty($email)) {
        throw new Exception('Email is required.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format.');
    }

    $stmt = $pdo->prepare("INSERT INTO subscribers (email, subscription_date) VALUES (:email, NOW())");
    $stmt->execute(['email' => $email]);

    $response['success'] = true;
    $response['message'] = 'Thank you for subscribing!';
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32)); // Regenerate CSRF token
} catch (PDOException $e) {
    error_log("PDO Error: " . $e->getMessage(), 3, "$logDir/db.log");
    $response['message'] = $e->getCode() == 23000 ? 'This email is already subscribed.' : 'An error occurred while processing your request.';
} catch (Exception $e) {
    error_log("General Error: " . $e->getMessage(), 3, "$logDir/errors.log");
    $response['message'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
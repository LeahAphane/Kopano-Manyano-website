<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$host = 'localhost';
$dbname = 'kmgc_db';
$username = 'root';
$password = '';

$response = ['success' => false, 'message' => ''];

ini_set('display_errors', 0);
error_reporting(E_ALL);

if (!file_exists('../logs')) {
    mkdir('../logs', 0777, true);
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("Database connection successful", 3, '../logs/db.log');

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method.');
    }

    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        error_log("CSRF validation failed: Received " . ($_POST['csrf_token'] ?? 'none') . ", Expected " . ($_SESSION['csrf_token'] ?? 'none'), 3, '../logs/csrf.log');
        throw new Exception('Invalid CSRF token.');
    }

    error_log("Form data: " . print_r($_POST, true), 3, '../logs/form.log');

    $full_name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $amount = filter_input(INPUT_POST, 'amount', FILTER_SANITIZE_STRING);
    $custom_amount = filter_input(INPUT_POST, 'custom-amount', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

    if (empty($full_name) || empty($email) || empty($amount)) {
        throw new Exception('All fields are required.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format.');
    }

    $final_amount = $amount === 'custom' ? $custom_amount : floatval($amount);
    if ($final_amount <= 0) {
        throw new Exception('Donation amount must be greater than 0.');
    }

    $stmt = $pdo->prepare("
        INSERT INTO donations (full_name, email, amount, donation_date)
        VALUES (:name, :email, :amount, NOW())
    ");
    $stmt->execute([
        ':name' => $full_name,
        ':email' => $email,
        ':amount' => $final_amount
    ]);

    $response['success'] = true;
    $response['message'] = 'Thank you for your donation! We’ll contact you soon.';
} catch (PDOException $e) {
    error_log("PDO Error: " . $e->getMessage(), 3, '../logs/db.log');
    $response['message'] = $e->getCode() == 23000 ? 'This email is already registered for a donation.' : 'Database error: ' . $e->getMessage();
} catch (Exception $e) {
    error_log("General Error: " . $e->getMessage(), 3, '../logs/errors.log');
    $response['message'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
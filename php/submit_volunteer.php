<?php
  if (session_status() === PHP_SESSION_NONE) {
      session_start();
  }
  $host = 'localhost';
  $dbname = 'kmgc_db';
  $username = 'root'; 
  $password = ''; 
  $response = ['success' => false, 'message' => ''];

  ini_set('display_errors', 0); // Disable in production
  error_reporting(E_ALL);

  try {
      $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
          throw new Exception('Invalid request method.');
      }

      if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
          throw new Exception('Invalid CSRF token.');
      }

      $full_name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
      $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
      $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
      $role = filter_input(INPUT_POST, 'role', FILTER_SANITIZE_STRING);

      if (empty($full_name) || empty($email) || empty($phone) || empty($role)) {
          throw new Exception('All fields are required.');
      }

      if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
          throw new Exception('Invalid email format.');
      }

      if (!preg_match('/^[0-9]{10}$/', $phone)) {
          throw new Exception('Phone number must be exactly 10 digits.');
      }

      $role_map = [
          'meal-prep' => 1,
          'shelter-support' => 2,
          'outreach' => 3,
          'workshops' => 4
      ];

      if (!isset($role_map[$role])) {
          throw new Exception('Invalid role selected.');
      }

      $stmt = $pdo->prepare("
          INSERT INTO volunteers (full_name, email, phone_number, preferred_role_id)
          VALUES (:name, :email, :phone, :role_id)
      ");
      $stmt->execute([
          ':name' => $full_name,
          ':email' => $email,
          ':phone' => $phone,
          ':role_id' => $role_map[$role]
      ]);

      $response['success'] = true;
      $response['message'] = 'Thank you for signing up! Our team will contact you soon.';
  } catch (PDOException $e) {
      error_log("PDO Error: " . $e->getMessage(), 3, '../logs/errors.log');
      $response['message'] = 'Database error: ' . $e->getMessage();
      if ($e->getCode() == 23000) {
          $response['message'] = 'This email is already registered.';
      }
  } catch (Exception $e) {
      error_log("General Error: " . $e->getMessage(), 3, '../logs/errors.log');
      $response['message'] = $e->getMessage();
  }

  header('Content-Type: application/json');
  echo json_encode($response);
  ?>
<?php
       $host = 'localhost';
       $dbname = 'kmgc_db';
       $username = 'root';
       $password = '';

       $response = ['success' => false, 'total' => 0];

       try {
           $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
           $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
           $stmt = $pdo->query("SELECT SUM(amount) AS total FROM donations");
           $result = $stmt->fetch(PDO::FETCH_ASSOC);
           $response['success'] = true;
           $response['total'] = floatval($result['total'] ?? 0);
       } catch (PDOException $e) {
           error_log("PDO Error: " . $e->getMessage(), 3, '../logs/db.log');
       }

       header('Content-Type: application/json');
       echo json_encode($response);
       ?>
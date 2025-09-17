<?php
require_once 'db_connect.php';

header('Content-Type: application/json');

$stmt = $pdo->query("SELECT id, title, description, date FROM events WHERE date >= CURDATE() ORDER BY date ASC");
$events = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($events);
?>
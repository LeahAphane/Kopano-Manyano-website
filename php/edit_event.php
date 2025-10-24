<?php
session_start();
require_once realpath(__DIR__ . '/../db_connect.php');

if (!isset($_SESSION['admin']) || !$_SESSION['admin']) {
    header('Location: ../php/login.php');
    exit;
}

$event_id = $_GET['id'] ?? null;

if (!$event_id) {
    header('Location: ../admin/dashboard.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title']);
    $description = trim($_POST['description']);
    $event_date = $_POST['event_date'];
    $location = trim($_POST['location'] ?? '');

    $stmt = $pdo->prepare("UPDATE events SET title = ?, description = ?, event_date = ?, location = ? WHERE event_id = ?");
    $stmt->execute([$title, $description, $event_date, $location, $event_id]);

    header('Location: ../admin/dashboard.php?success=event_updated');
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM events WHERE event_id = ?");
$stmt->execute([$event_id]);
$event = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$event) {
    die("Event not found.");
}

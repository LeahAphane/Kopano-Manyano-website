<?php
session_start();
require_once 'db_connect.php';

if (!isset($_SESSION['admin']) || !$_SESSION['admin']) {
    header('Location:../php/login.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = sanitize($_POST['title']);
    $description = sanitize($_POST['description']);
    $date = $_POST['date'];

    $stmt = $pdo->prepare("INSERT INTO events (title, description, date, created_at) VALUES (?, ?, ?, NOW())");
    if ($stmt->execute([$title, $description, $date])) {
        header('Location: /php/admin_dashboard.php');
        exit;
    } else {
        echo "Failed to add event";
    }
}

function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}
?>
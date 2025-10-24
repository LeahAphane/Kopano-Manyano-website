<?php
ob_start();
if (session_status() === PHP_SESSION_NONE) session_start();
header('Content-Type: application/json');

define('TESTING', true);

try {
    // Use in-memory database for tests
    $pdo = new PDO('sqlite::memory:');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec("
        CREATE TABLE events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            event_date TEXT,
            location TEXT
        );
    ");

    $pdo->exec("
        INSERT INTO events (title, description, event_date, location)
        VALUES 
            ('E1','D1','2025-12-01','L1'),
            ('E2','D2','2025-12-02','L2');
    ");

    $stmt = $pdo->query("SELECT * FROM events ORDER BY event_date ASC");
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    ob_end_clean();
    echo json_encode(['success' => true, 'data' => $events]);
} catch (Exception $e) {
    ob_end_clean();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

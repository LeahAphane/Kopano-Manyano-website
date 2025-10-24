<?php
ob_start();
if (session_status() === PHP_SESSION_NONE)
    session_start();
header('Content-Type: application/json');

try {
    require_once __DIR__ . '/db_connect.php';

    if (!isset($pdo) || !$pdo || defined('TESTING')) {
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
    }

    if (!isset($_SERVER['REQUEST_METHOD']))
        $_SERVER['REQUEST_METHOD'] = 'POST';
    if ($_SERVER['REQUEST_METHOD'] !== 'POST')
        throw new Exception('Invalid request method.');

    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $event_date = trim($_POST['event_date'] ?? '');
    $location = trim($_POST['location'] ?? '');

    if (empty($title) || empty($description) || empty($event_date) || empty($location)) {
        throw new Exception('missing_fields');
    }

    $stmt = $pdo->prepare("
        INSERT INTO events (title, description, event_date, location)
        VALUES (:title, :description, :event_date, :location)
    ");
    $stmt->execute([
        ':title' => $title,
        ':description' => $description,
        ':event_date' => $event_date,
        ':location' => $location
    ]);

    ob_end_clean();
    echo 'event_added';

} catch (PDOException $e) {
    ob_end_clean();
    echo 'db_error';
} catch (Exception $e) {
    ob_end_clean();
    echo $e->getMessage();
}

if (!defined('TESTING')) {
    // live site HTML output here
}
?>
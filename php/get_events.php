<?php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/db_connect.php';

    // If we’re running PHPUnit (TESTING defined), use in-memory SQLite instead of MySQL
    if (defined('TESTING')) {
        $pdo = new PDO('sqlite::memory:');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $pdo->exec("
            CREATE TABLE events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                event_date TEXT NOT NULL,
                location TEXT
            );
        ");

        $pdo->exec("
            INSERT INTO events (title, description, event_date, location)
            VALUES 
            ('E1', 'D1', '2025-12-01', 'L1'),
            ('E2', 'D2', '2025-12-02', 'L2');
        ");
    }

    // Fetch all events
    $stmt = $pdo->query("SELECT * FROM events ORDER BY event_date ASC");
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    ob_end_clean();
    echo json_encode($events);

} catch (PDOException $e) {
    ob_end_clean();
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    ob_end_clean();
    echo json_encode(['error' => 'Unexpected error: ' . $e->getMessage()]);
}

// Only output HTML when NOT testing
if (!defined('TESTING')) {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Events Page</title>
    </head>
    <body>
        <h1>Events</h1>
        <div id="events-container"></div>
    </body>
    </html>
    <?php
}
?>

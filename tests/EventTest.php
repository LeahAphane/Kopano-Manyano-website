<?php
use PHPUnit\Framework\TestCase;

define('TESTING', true);

class EventTest extends TestCase
{
    private $pdo;

    protected function setUp(): void
    {
        // ✅ Use an in-memory SQLite DB for testing (no real DB connection needed)
        $this->pdo = new PDO("sqlite::memory:");
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // ✅ Create the events table structure (temporary)
        $this->pdo->exec("
            CREATE TABLE events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                event_date TEXT NOT NULL,
                location TEXT NOT NULL
            )
        ");
    }

    public function testAddEventSuccess()
    {
        $title = "Charity Walk";
        $description = "A fun community walk";
        $date = "2025-12-10";
        $location = "Johannesburg";

        $stmt = $this->pdo->prepare("INSERT INTO events (title, description, event_date, location) VALUES (?, ?, ?, ?)");
        $result = $stmt->execute([$title, $description, $date, $location]);

        $this->assertTrue($result);

        // Verify the record was added
        $stmt = $this->pdo->query("SELECT COUNT(*) FROM events");
        $count = $stmt->fetchColumn();
        $this->assertEquals(1, $count);
    }

    public function testAddEventMissingFields()
    {
        // Expect a failure due to NOT NULL constraints
        $this->expectException(PDOException::class);

        $stmt = $this->pdo->prepare("INSERT INTO events (title, description, event_date, location) VALUES (?, ?, ?, ?)");
        $stmt->execute([null, null, null, null]);
    }

    public function testGetEvents()
    {
        // Insert sample events
        $this->pdo->exec("
            INSERT INTO events (title, description, event_date, location)
            VALUES 
                ('E1', 'D1', '2025-12-01', 'L1'),
                ('E2', 'D2', '2025-12-02', 'L2')
        ");

        $stmt = $this->pdo->query("SELECT * FROM events ORDER BY event_date ASC");
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $this->assertIsArray($events);
        $this->assertCount(2, $events);
        $this->assertEquals('E1', $events[0]['title']);
    }
}

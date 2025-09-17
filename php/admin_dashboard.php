<?php
session_start();
require_once 'db_connect.php';

if (!isset($_SESSION['admin']) || !$_SESSION['admin']) {
    header('Location:../php/login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Kopano Manyano</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans">
    <header class="bg-gray-900 text-white py-4">
        <div class="container mx-auto px-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold">Admin Dashboard</h1>
            <a href="/php/logout.php" class="text-red-500 hover:underline">Logout</a>
        </div>
    </header>

    <main class="container mx-auto px-4 py-8">
        <h2 class="text-3xl font-bold mb-6">Manage Kopano Manyano</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Users -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4">Users</h3>
                <?php
                $stmt = $pdo->query("SELECT id, username, email FROM users");
                while ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    echo "<p> {$user['username']} ({$user['email']}) <a href='/php/edit_user.php?id={$user['id']}' class='text-blue-500'>Edit</a></p>";
                }
                ?>
            </div>
            <!-- Donations -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4">Donations</h3>
                <?php
                $stmt = $pdo->query("SELECT name, email, amount, created_at FROM donations ORDER BY created_at DESC LIMIT 5");
                while ($donation = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    echo "<p>{$donation['name']} donated R{$donation['amount']} on {$donation['created_at']}</p>";
                }
                ?>
            </div>
            <!-- Volunteers -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4">Volunteers</h3>
                <?php
                $stmt = $pdo->query("SELECT name, email, phone, created_at FROM volunteers ORDER BY created_at DESC LIMIT 5");
                while ($volunteer = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    echo "<p>{$volunteer['name']} ({$volunteer['phone']}) on {$volunteer['created_at']}</p>";
                }
                ?>
            </div>
            <!-- Events -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4">Events</h3>
                <form action="/php/add_event.php" method="POST" class="space-y-4">
                    <input type="text" name="title" placeholder="Event Title" class="w-full p-2 border rounded" required>
                    <textarea name="description" placeholder="Event Description" class="w-full p-2 border rounded" required></textarea>
                    <input type="date" name="date" class="w-full p-2 border rounded" required>
                    <button type="submit" class="bg-blue-500 text-white p-2 rounded">Add Event</button>
                </form>
                <?php
                $stmt = $pdo->query("SELECT id, title, date FROM events ORDER BY date DESC LIMIT 5");
                while ($event = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    echo "<p>{$event['title']} on {$event['date']} <a href='/php/edit_event.php?id={$event['id']}' class='text-blue-500'>Edit</a></p>";
                }
                ?>
            </div>
        </div>
    </main>
</body>
</html>
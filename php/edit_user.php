<?php
session_start();
require_once '../db_connect.php';

if (!isset($_SESSION['admin']) || !$_SESSION['admin']) {
    header('Location:../php/login.php');
    exit;
}

$id = $_GET['id'] ?? null;

if (!$id) {
    header('Location: ../admin/dashboard.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $is_admin = isset($_POST['is_admin']) ? 1 : 0;

    $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ?, is_admin = ? WHERE id = ?");
    $stmt->execute([$username, $email, $is_admin, $id]);

    header('Location: ../admin/dashboard.php?success=user_updated');
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    die("User not found.");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit User - Kopano Manyano</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex justify-center items-center min-h-screen">
    <form method="POST" class="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 class="text-2xl font-bold mb-6 text-center">Edit User</h1>

        <label class="block mb-2">Username</label>
        <input type="text" name="username" value="<?= htmlspecialchars($user['username']) ?>" required class="w-full p-2 border rounded mb-4">

        <label class="block mb-2">Email</label>
        <input type="email" name="email" value="<?= htmlspecialchars($user['email']) ?>" required class="w-full p-2 border rounded mb-4">

        <label class="inline-flex items-center">
            <input type="checkbox" name="is_admin" <?= $user['is_admin'] ? 'checked' : '' ?> class="mr-2">
            <span>Admin</span>
        </label>

        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded mt-4">Save Changes</button>
        <a href="../admin/dashboard.php" class="block text-center text-gray-600 mt-4 hover:underline">Back to Dashboard</a>
    </form>
</body>
</html>

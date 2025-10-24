<?php
session_start();
require_once 'auto_login.php'; // Assuming this handles session check

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

// Database connection
$host = 'localhost';
$dbname = 'kmgc_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Fetch current user data
$stmt = $pdo->prepare("SELECT username, email, profile_pic FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$currentUser = $stmt->fetch(PDO::FETCH_ASSOC);

$username = $currentUser['username'];
$email = $currentUser['email'];
$profilePic = $currentUser['profile_pic'] ?? 'https://via.placeholder.com/120?text=Profile'; // Default if no pic

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newUsername = trim($_POST['username']);
    $newEmail = trim($_POST['email']);
    $newPassword = !empty($_POST['password']) ? password_hash($_POST['password'], PASSWORD_DEFAULT) : null;

    // Handle profile picture upload
    $newProfilePic = $profilePic;
    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === 0) {
        $uploadDir = '../uploads/profile_pics/'; // Create this directory
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $fileName = $_SESSION['user_id'] . '_' . basename($_FILES['profile_pic']['name']);
        $targetPath = $uploadDir . $fileName;

        // Validate file type
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        if (in_array($fileExt, $allowedTypes) && move_uploaded_file($_FILES['profile_pic']['tmp_name'], $targetPath)) {
            $newProfilePic = $targetPath;
        } else {
            $error = 'Invalid file or upload error.';
        }
    }

    // Update query
    $updateSql = "UPDATE users SET username = ?, email = ?, profile_pic = ?" . ($newPassword ? ", password = ?" : "") . " WHERE id = ?";
    $updateParams = [$newUsername, $newEmail, $newProfilePic];
    if ($newPassword) {
        $updateParams[] = $newPassword;
    }
    $updateParams[] = $_SESSION['user_id'];

    $updateStmt = $pdo->prepare($updateSql);
    if ($updateStmt->execute($updateParams)) {
        $_SESSION['username'] = $newUsername;
        header("Location: profile.php");
        exit;
    } else {
        $error = 'Update failed.';
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Profile - Kopano Manyano</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        crossorigin="anonymous" referrerpolicy="no-referrer">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../css/Home Page.css"> <!-- Reuse homepage CSS for consistency -->
    <style>
        :root {
            --primary-color: #ef4444;
            --secondary-color: #111827;
        }

        body {
            background: linear-gradient(to bottom right, #f3f4f6, #e5e7eb);
        }

        .edit-container {
            max-width: 600px;
            margin: 2rem auto;
            padding: 2rem;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--secondary-color);
        }

        .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            outline: none;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .form-group input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
    </style>
</head>

<body>
    <!-- Header (same as profile) -->
    <header
        class="bg-gradient-to-r from-[var(--primary-color)] to-gray-900 text-white fixed w-full top-0 z-50 transition-all duration-300"
        role="banner" aria-label="Main navigation">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <div class="logo">
                <a href="Home Page.php" aria-label="Kopano Manyano Home">
                    <img src="../Images/LOGO.jpeg" alt="Kopano Manyano Logo" class="w-24" loading="lazy">
                </a>
            </div>
            <nav class="flex items-center" role="navigation">
                <button class="hamburger md:hidden text-2xl bg-none border-none" aria-label="Toggle menu"
                    aria-expanded="false" aria-controls="nav-menu"><i class="fas fa-bars"></i></button>
                <ul class="nav-menu hidden md:flex space-x-4 bg-gray-900 md:bg-transparent absolute md:static top-16 left-0 w-full md:w-auto p-4 md:p-0 transition-all duration-300"
                    id="nav-menu">
                    <li><a href="Home Page.php" class="btn-primary" aria-label="Home">Home</a></li>
                    <li><a href="About Us.html" class="btn-primary" aria-label="About">About</a></li>
                    <li class="services-nav-item relative">
                        <button class="btn-primary" aria-label="Services" aria-expanded="false"
                            aria-controls="services-dropdown">Services <i class="fas fa-chevron-down ml-1"></i></button>
                        <ul class="services-dropdown absolute bg-gray-900 w-48 mt-2 rounded-md shadow-lg hidden"
                            id="services-dropdown" role="menu">
                            <li><a href="Events.html"
                                    class="block px-4 py-2 text-white hover:bg-[var(--primary-color)] hover:text-gray-900 transition-colors"
                                    aria-label="Events">Events</a></li>
                            <li><a href="Food Assistance.html"
                                    class="block px-4 py-2 text-white hover:bg-[var(--primary-color)] hover:text-gray-900 transition-colors"
                                    aria-label="Food Assistance">Food Assistance</a></li>
                            <li><a href="Volunteer.html"
                                    class="block px-4 py-2 text-white hover:bg-[var(--primary-color)] hover:text-gray-900 transition-colors"
                                    aria-label="Volunteer">Volunteer</a></li>
                            <li><a href="shelter programs.html"
                                    class="block px-4 py-2 text-white hover:bg-[var(--primary-color)] hover:text-gray-900 transition-colors"
                                    aria-label="Shelter Program">Shelter Program</a></li>
                            <li><a href="Community Engagement.html"
                                    class="block px-4 py-2 text-white hover:bg-[var(--primary-color)] hover:text-gray-900 transition-colors"
                                    aria-label="Community Engagement">Community Engagement</a></li>
                        </ul>
                    </li>
                    <li><a href="Volunteer.html" class="btn-primary" aria-label="Get Involved">Get Involved</a></li>
                    <li><a href="Gallery.html" class="btn-primary" aria-label="Gallery">Gallery</a></li>
                    <li><a href="Contact Us.html" class="btn-primary" aria-label="Contact">Contact</a></li>
                    <li><a href="Donate.html" class="btn-primary" aria-label="Donate">Donate</a></li>
                    <li><a href="profile.php" class="btn-primary" aria-label="Profile"><i class="fas fa-user"></i></a>
                    </li>
                    <li><a href="logout.php" class="btn-primary" aria-label="Logout">Logout</a></li>
                </ul>
                <button class="theme-toggle ml-4 text-2xl" aria-label="Toggle dark theme"><i
                        class="fas fa-moon"></i></button>
            </nav>
        </div>
    </header>

    <main class="container mx-auto px-4 py-16 mt-16">
        <div class="edit-container">
            <h1 class="text-3xl font-bold text-center mb-8 text-[var(--primary-color)]">Edit Profile</h1>

            <?php if (isset($error)): ?>
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                    <?php echo $error; ?>
                </div>
            <?php endif; ?>

            <form method="POST" enctype="multipart/form-data" class="space-y-6">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($username); ?>"
                        required>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email); ?>"
                        required>
                </div>

                <div class="form-group">
                    <label for="password">New Password (leave blank to keep current)</label>
                    <input type="password" id="password" name="password" placeholder="Enter new password">
                </div>

                <div class="form-group">
                    <label for="profile_pic">Profile Picture</label>
                    <input type="file" id="profile_pic" name="profile_pic" accept="image/*">
                    <p class="text-sm text-gray-500 mt-1">Current: <img
                            src="<?php echo htmlspecialchars($profilePic); ?>" alt="Current Profile Pic"
                            class="w-16 h-16 rounded-full inline-block"></p>
                </div>

                <div class="text-center">
                    <button type="submit"
                        class="px-6 py-3 bg-[var(--primary-color)] text-white rounded-full font-semibold hover:bg-red-600 transition-colors">Save
                        Changes</button>
                    <a href="profile.php"
                        class="ml-4 px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition-colors">Cancel</a>
                </div>
            </form>
        </div>
    </main>

    <!-- Footer (reuse from homepage) -->
    <footer class="bg-[var(--secondary-color)] text-white py-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4">Kopano Manyano</h3>
                    <p>Providing shelter, food, and support to empower homeless individuals in Gauteng.</p>
                </div>
                <div>
                    <h3 class="text-xl font-bold mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li><a href="About Us.html" class="hover:text-[var(--primary-color)] transition-colors">More
                                About Kopano Manyano</a></li>
                        <li><a href="Volunteer.html"
                                class="hover:text-[var(--primary-color)] transition-colors">Volunteer</a></li>
                        <li><a href="Contact Us.html"
                                class="hover:text-[var(--primary-color)] transition-colors">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-xl font-bold mb-4">Follow Us</h3>
                    <div class="flex space-x-4">
                        <a href="https://x.com/catherinemogal1"
                            class="text-2xl hover:text-[var(--primary-color)] transition-colors"
                            aria-label="Follow us on X"><i class="fab fa-x"></i></a>
                        <a href="https://www.facebook.com/share/1D1CozKDnV/?mibextid=wwXIfr"
                            class="text-2xl hover:text-[var(--primary-color)] transition-colors"
                            aria-label="Follow us on Facebook"><i class="fab fa-facebook"></i></a>
                    </div>
                </div>
            </div>
            <p class="text-center mt-8">© 2025 Kopano Manyano God the Founder Center for Homeless. All rights reserved.
            </p>
        </div>
    </footer>

    <script src="../jss/Home Page.js"></script> <!-- Reuse JS if applicable -->
</body>

</html>
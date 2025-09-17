<?php
session_start();
session_unset();
session_destroy();
setcookie('remember_token', '', time() - 3600, '/', '', false, true);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logging Out</title>
</head>
<body>
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
        import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

        window.onerror = function (message, source, lineno, colno, error) {
            console.error('Script error:', { message, source, lineno, colno, error });
            return false;
        };
        window.addEventListener('unhandledrejection', function (event) {
            console.error('Unhandled promise rejection:', event.reason);
        });

        const firebaseConfig = {
            apiKey: "AIzaSyDuRUMkjXSbC5Hck66pWxrfCyKgsX4OQcs",
            authDomain: "kmgc-8a098.firebaseapp.com",
            projectId: "kmgc-8a098",
            storageBucket: "kmgc-8a098.firebasestorage.app",
            messagingSenderId: "555860443297",
            appId: "1:555860443297:web:eaef8fbdd40a72687e30e0",
            measurementId: "G-GTGX7VKYDT"
        };

        try {
            const app = initializeApp(firebaseConfig);
            console.log('Firebase initialized');
            const auth = getAuth(app);
            signOut(auth).then(() => {
                console.log('Firebase sign-out successful');
                window.location.href = '/My%20Website/php/login.php?success=' + encodeURIComponent('You have been logged out.');
            }).catch((error) => {
                console.error('Logout error:', error);
                window.location.href = '/My%20Website/php/login.php?success=' + encodeURIComponent('You have been logged out.');
            });
        } catch (error) {
            console.error('Firebase initialization error:', error);
            window.location.href = '/My%20Website/php/login.php?success=' + encodeURIComponent('You have been logged out.');
        }
    </script>
</body>
</html>
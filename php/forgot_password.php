<?php
session_start();

// Redirect to homepage if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: /My%20Website/html/Home%20Page.html');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - Kopano Manyano</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #ff0000 0%, #ffffff 100%);
            overflow: hidden;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            padding: 2.5rem;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 450px;
            position: relative;
            overflow: hidden;
            animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(25px); }
            to { opacity: 1; transform: translateY(0); }
        }
        h2 {
            text-align: center;
            color: #ff0000;
            margin-bottom: 2rem;
            font-size: 2rem;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .form-group {
            position: relative;
            margin-bottom: 1.5rem;
        }
        .form-group label {
            position: absolute;
            top: 50%;
            left: 15px;
            transform: translateY(-50%);
            color: #555;
            transition: 0.3s;
            pointer-events: none;
        }
        .form-group input:focus + label,
        .form-group input:not(:placeholder-shown) + label {
            top: -10px;
            left: 10px;
            font-size: 0.8rem;
            color: #ff0000;
            background: white;
            padding: 0 5px;
        }
        input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #ff0000;
            border-radius: 8px;
            font-size: 1rem;
            background: rgba(255, 255, 255, 0.8);
            transition: all 0.3s;
        }
        input:focus {
            outline: none;
            border-color: #cc0000;
            box-shadow: 0 0 8px rgba(255, 0, 0, 0.3);
        }
        button {
            width: 100%;
            padding: 1rem;
            background: #ff0000;
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.3s;
        }
        button:hover {
            background: #cc0000;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        button:disabled {
            background: #ff6666;
            cursor: not-allowed;
        }
        .spinner {
            display: none;
            border: 4px solid #ffffff;
            border-top: 4px solid #ff0000;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .error, .success {
            display: none;
            padding: 1rem;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            text-align: center;
            font-weight: bold;
        }
        .error {
            background: #ffe6e6;
            color: #cc0000;
        }
        .success {
            background: #e6ffe6;
            color: #006600;
        }
        .links {
            margin-top: 1.5rem;
            text-align: center;
        }
        .links a {
            color: #ff0000;
            text-decoration: none;
            margin: 0 0.5rem;
            font-weight: bold;
        }
        .links a:hover {
            text-decoration: underline;
        }
        .background-shapes {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
        }
        .shape {
            position: absolute;
            background: rgba(255, 0, 0, 0.1);
            border-radius: 50%;
            animation: float 15s infinite;
        }
        .shape:nth-child(1) {
            width: 200px;
            height: 200px;
            top: 10%;
            left: 15%;
        }
        .shape:nth-child(2) {
            width: 150px;
            height: 150px;
            top: 60%;
            right: 20%;
            animation-delay: 5s;
        }
        .shape:nth-child(3) {
            width: 100px;
            height: 100px;
            bottom: 10%;
            left: 30%;
            animation-delay: 10s;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
    </style>
</head>
<body>
    <div class="background-shapes">
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
    </div>
    <div class="container">
        <h2>Forgot Password</h2>
        <div class="error" id="errorMsg">
            <?php if (isset($_GET['error'])) echo htmlspecialchars($_GET['error']); ?>
        </div>
        <div class="success" id="successMsg">
            <?php if (isset($_GET['success'])) echo htmlspecialchars($_GET['success']); ?>
        </div>
        <form id="resetForm">
            <div class="form-group">
                <input type="email" id="email" name="email" placeholder=" " required>
                <label for="email">Email</label>
            </div>
            <button type="submit" id="submitBtn">Send Reset Email <span class="spinner"></span></button>
        </form>
        <div class="links">
            <a href="/My%20Website/php/login.php">Back to Login</a> |
            <a href="/My%20Website/php/signup.php">Sign Up</a>
        </div>
    </div>

    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
        import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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

        let auth;
        try {
            const app = initializeApp(firebaseConfig);
            console.log('Firebase initialized');
            auth = getAuth(app);
        } catch (error) {
            console.error('Firebase init error:', error);
            const errorMsg = document.getElementById('errorMsg');
            if (errorMsg) {
                errorMsg.textContent = 'Failed to initialize Firebase. Please try again.';
                errorMsg.style.display = 'block';
            }
        }

        document.getElementById('resetForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const submitBtn = document.getElementById('submitBtn');
            const spinner = submitBtn.querySelector('.spinner');
            const errorMsg = document.getElementById('errorMsg');
            const successMsg = document.getElementById('successMsg');

            if (!emailInput || !submitBtn || !errorMsg || !successMsg) {
                console.error('Form elements not found');
                if (errorMsg) {
                    errorMsg.textContent = 'Form error. Please refresh the page.';
                    errorMsg.style.display = 'block';
                }
                return;
            }

            const email = emailInput.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            errorMsg.textContent = '';
            errorMsg.style.display = 'none';
            successMsg.textContent = '';
            successMsg.style.display = 'none';

            if (!emailRegex.test(email)) {
                errorMsg.textContent = 'Please enter a valid email address.';
                errorMsg.style.display = 'block';
                return;
            }

            if (!auth) {
                errorMsg.textContent = 'Firebase not initialized. Please refresh the page.';
                errorMsg.style.display = 'block';
                return;
            }

            submitBtn.disabled = true;
            spinner.style.display = 'inline-block';

            try {
                await sendPasswordResetEmail(auth, email);
                successMsg.textContent = 'Password reset email sent! Check your inbox.';
                successMsg.style.display = 'block';
                emailInput.value = '';
            } catch (error) {
                console.error('Reset error:', error);
                let errorMessage = 'Failed to send reset email. Please try again.';
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'No account found with this email.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Invalid email address.';
                }
                errorMsg.textContent = errorMessage;
                errorMsg.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                spinner.style.display = 'none';
            }
        });
        await sendPasswordResetEmail(auth, email, {
    url: 'http://localhost:8000/My%20Website/php/login.php',
    handleCodeInApp: false
});

let lastSubmission = 0;
if (Date.now() - lastSubmission < 30000) {
    errorMsg.textContent = 'Please wait 30 seconds before trying again.';
    errorMsg.style.display = 'block';
    return;
}
lastSubmission = Date.now();
    </script>
</body>
</html>
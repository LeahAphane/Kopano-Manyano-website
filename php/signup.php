<?php
session_start();

// Redirect to homepage if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: /My%20Website/php/login.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup - Kopano Manyano</title>
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
            animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
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
        .password-container {
            position: relative;
        }
        .toggle-password {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #ff0000;
            font-size: 0.9rem;
            font-weight: bold;
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
        }
        .checkbox-group input {
            width: auto;
            margin-right: 0.5rem;
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
        <h2>Sign Up</h2>
        <div class="error" id="errorMsg">
            <?php if (isset($_GET['error'])) echo htmlspecialchars($_GET['error']); ?>
        </div>
        <div class="success" id="successMsg">
            <?php if (isset($_GET['success'])) echo htmlspecialchars($_GET['success']); ?>
        </div>
        <form id="signupForm">
            <div class="form-group">
                <input type="text" id="username" name="username" placeholder=" " required>
                <label for="username">Username</label>
            </div>
            <div class="form-group">
                <input type="email" id="email" name="email" placeholder=" " required>
                <label for="email">Email</label>
            </div>
            <div class="form-group password-container">
                <input type="password" id="password" name="password" placeholder=" " required>
                <label for="password">Password</label>
                <span class="toggle-password" onclick="togglePassword()">Show</span>
            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="terms" name="terms" required>
                <label for="terms">I agree to the <a href="/My%20Website/php/terms.php" style="color: #ff0000;">Terms of Service</a></label>
            </div>
            <button type="submit" id="submitBtn">Sign Up <span class="spinner"></span></button>
        </form>
        <div class="links">
            <a href="/My%20Website/php/login.php">Already have an account? Login</a>
        </div>
    </div>

    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
        import { getAuth, createUserWithEmailAndPassword, updateProfile, getIdToken } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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
        } catch (error) {
            console.error('Firebase init error:', error);
            document.getElementById('errorMsg').textContent = 'Failed to initialize Firebase. Please try again.';
            document.getElementById('errorMsg').style.display = 'block';
        }

        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleText = document.querySelector('.toggle-password');
            if (passwordInput && toggleText) {
                passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
                toggleText.textContent = passwordInput.type === 'password' ? 'Show' : 'Hide';
            } else {
                console.error('Password input or toggle text not found');
            }
        }

        document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const termsInput = document.getElementById('terms');
            const submitBtn = document.getElementById('submitBtn');
            const spinner = submitBtn.querySelector('.spinner');
            const errorMsg = document.getElementById('errorMsg');
            const successMsg = document.getElementById('successMsg');

            if (!usernameInput || !emailInput || !passwordInput || !termsInput || !submitBtn || !errorMsg || !successMsg) {
                console.error('Form elements not found');
                errorMsg.textContent = 'Form error. Please refresh the page.';
                errorMsg.style.display = 'block';
                return;
            }

            const username = usernameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            const terms = termsInput.checked;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            errorMsg.textContent = '';
            errorMsg.style.display = 'none';
            successMsg.textContent = '';
            successMsg.style.display = 'none';

            if (username.length < 3) {
                errorMsg.textContent = 'Username must be at least 3 characters long.';
                errorMsg.style.display = 'block';
                return;
            }

            if (!emailRegex.test(email)) {
                errorMsg.textContent = 'Please enter a valid email address.';
                errorMsg.style.display = 'block';
                return;
            }

            if (password.length < 6) {
                errorMsg.textContent = 'Password must be at least 6 characters long.';
                errorMsg.style.display = 'block';
                return;
            }

            if (!terms) {
                errorMsg.textContent = 'You must agree to the Terms of Service.';
                errorMsg.style.display = 'block';
                return;
            }

            submitBtn.disabled = true;
            spinner.style.display = 'inline-block';

            try {
                const auth = getAuth();
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log('Firebase user created:', user.uid);
                await updateProfile(user, { displayName: username });
                const idToken = await getIdToken(user);

                const response = await fetch('/My%20Website/php/signup_process.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `idToken=${encodeURIComponent(idToken)}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&terms=${terms ? 1 : 0}`
                });

                const responseText = await response.text();
                console.log('Raw server response:', responseText, 'Status:', response.status);

                try {
                    const result = JSON.parse(responseText);
                    console.log('Parsed response:', result);
                    if (result.success) {
                        successMsg.textContent = 'Signup successful! Redirecting to login...';
                        successMsg.style.display = 'block';
                        setTimeout(() => {
                            window.location.href = '/My%20Website/php/login.php?success=' + encodeURIComponent('Signup successful! Please login.');
                        }, 2000);
                    } else {
                        errorMsg.textContent = result.error || 'Failed to process signup.';
                        errorMsg.style.display = 'block';
                    }
                } catch (jsonError) {
                    console.error('JSON parse error:', jsonError, 'Response:', responseText);
                    errorMsg.textContent = 'Server response error. Please try again.';
                    errorMsg.style.display = 'block';
                }
            } catch (error) {
                console.error('Signup error:', error);
                errorMsg.textContent = error.message || 'An error occurred during signup.';
                errorMsg.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                spinner.style.display = 'none';
            }
        });
    </script>
</body>
</html>
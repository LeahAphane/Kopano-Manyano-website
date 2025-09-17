
    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const emailError = document.getElementById('emailError');
                const passwordError = document.getElementById('passwordError');
                const successMessage = document.getElementById('successMessage');

                emailError.style.display = 'none';
                passwordError.style.display = 'none';
                successMessage.style.display = 'none';

                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    emailError.style.display = 'block';
                    return;
                }
                if (!password || password.length < 6) {
                    passwordError.style.display = 'block';
                    return;
                }

                const formData = new FormData(loginForm);
                try {
                    const response = await fetch('php/login.php', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    console.log('Login Response:', result); // Debug log
                    if (result.success) {
                        successMessage.textContent = result.message;
                        successMessage.style.display = 'block';
                        setTimeout(() => {
                            window.location.href = 'html/Home Page.html'; // Updated path
                        }, 1000);
                    } else {
                        if (result.message.includes('email')) emailError.textContent = result.message;
                        else passwordError.textContent = result.message;
                        (emailError.textContent ? emailError : passwordError).style.display = 'block';
                    }
                } catch (error) {
                    console.error('Fetch error:', error);
                    emailError.textContent = 'An error occurred. Please try again.';
                    emailError.style.display = 'block';
                }
            });

            const forgotPassword = document.getElementById('forgotPassword');
            if (forgotPassword) {
                forgotPassword.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const email = prompt('Enter your email to reset your password:');
                    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                        alert('Please enter a valid email address.');
                        return;
                    }

                    try {
                        const response = await fetch('php/reset_password.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: `email=${encodeURIComponent(email)}`
                        });
                        const result = await response.json();
                        console.log('Reset Response:', result);
                        alert(result.message);
                    } catch (error) {
                        console.error('Reset error:', error);
                        alert('An error occurred while resetting the password.');
                    }
                });
            }

            const toggleTheme = () => document.body.classList.toggle('dark-theme');
            const themeButton = document.createElement('button');
            themeButton.textContent = 'Toggle Theme';
            themeButton.className = 'btn-primary';
            themeButton.style.margin = '1.5rem auto';
            themeButton.style.display = 'block';
            themeButton.style.width = 'auto';
            themeButton.style.padding = '0.5rem 1.5rem';
            document.querySelector('.form-container').appendChild(themeButton);
            themeButton.addEventListener('click', toggleTheme);
        }
    });

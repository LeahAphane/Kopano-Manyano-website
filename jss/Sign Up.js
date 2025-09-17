
    document.addEventListener('DOMContentLoaded', () => {
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const nameError = document.getElementById('nameError');
                const emailError = document.getElementById('emailError');
                const passwordError = document.getElementById('passwordError');
                const successMessage = document.getElementById('successMessage');

                nameError.style.display = 'none';
                emailError.style.display = 'none';
                passwordError.style.display = 'none';
                successMessage.style.display = 'none';

                if (!name || name.trim().length < 2) {
                    nameError.style.display = 'block';
                    return;
                }
                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    emailError.style.display = 'block';
                    return;
                }
                if (!password || password.length < 6) {
                    passwordError.style.display = 'block';
                    return;
                }

                const formData = new FormData(signupForm);
                try {
                    const response = await fetch('php/Sign Up.php', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    console.log('Signup Response:', result); // Debug log
                    if (result.success) {
                        successMessage.textContent = result.message;
                        successMessage.style.display = 'block';
                        setTimeout(() => {
                            window.location.href = 'html/login.html';
                        }, 1000);
                    } else {
                        if (result.message.includes('email')) emailError.textContent = result.message;
                        else if (result.message.includes('name')) nameError.textContent = result.message;
                        else passwordError.textContent = result.message;
                        (emailError.textContent ? emailError : nameError.textContent ? nameError : passwordError).style.display = 'block';
                    }
                } catch (error) {
                    console.error('Fetch error:', error);
                    emailError.textContent = 'An error occurred. Please try again.';
                    emailError.style.display = 'block';
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
    });

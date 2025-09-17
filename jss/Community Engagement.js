     // Navigation
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const themeToggle = document.querySelector('.theme-toggle');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('hidden');
            });
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            });
        }

        // Header Scroll Effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('main-header');
            header.classList.toggle('scrolled', window.scrollY > 50);
        });

        // Newsletter Form Validation
        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value.trim();
                if (validateEmail(email)) {
                    const success = document.getElementById('newsletter-success');
                    if (success) {
                        success.textContent = `Subscribed with ${email}!`;
                        success.classList.remove('hidden');
                    }
                    newsletterForm.reset();
                } else {
                    alert('Please enter a valid email address.');
                }
            });
        }
// Hamburger menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
            navMenu.classList.toggle('open');
            const isOpen = navMenu.classList.contains('open');
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const icon = themeToggle.querySelector('i');
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
        });

        // Newsletter form submission
        document.getElementById('newsletter-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const successMessage = document.getElementById('newsletter-success');
            successMessage.textContent = 'Thank you for subscribing!';
            successMessage.classList.remove('hidden');
            setTimeout(() => successMessage.classList.add('hidden'), 3000);
            e.target.reset();
        });

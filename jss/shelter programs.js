// Hamburger menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
            hamburger.innerHTML = navMenu.classList.contains('hidden') ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
        });

        // Services dropdown toggle for mobile
        const servicesMenu = document.querySelector('.services-menu');
        servicesMenu.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                servicesMenu.classList.toggle('active');
            }
        });

        // Theme toggle (placeholder)
        const themeToggle = document.querySelector('.theme-toggle');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
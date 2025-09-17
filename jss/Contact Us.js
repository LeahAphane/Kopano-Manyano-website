// Hamburger menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });

        // Services dropdown toggle
        const servicesButton = document.querySelector('.btn-primary');
        const servicesDropdown = document.querySelector('.services-dropdown');
        servicesButton.addEventListener('click', () => {
            servicesDropdown.classList.toggle('open');
            const isOpen = servicesDropdown.classList.contains('open');
            servicesButton.setAttribute('aria-expanded', isOpen);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!servicesButton.contains(e.target) && !servicesDropdown.contains(e.target)) {
                servicesDropdown.classList.remove('open');
                servicesButton.setAttribute('aria-expanded', 'false');
            }
        });

        // Contact form validation and submission
        const contactForm = document.querySelector('#contact-form');
        const nameInput = document.querySelector('#name');
        const emailInput = document.querySelector('#email');
        const messageInput = document.querySelector('#message');
        const nameError = document.querySelector('#name-error');
        const emailError = document.querySelector('#email-error');
        const messageError = document.querySelector('#message-error');
        const contactSuccess = document.querySelector('#contact-success');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let hasError = false;

            // Reset error messages
            nameError.classList.remove('show');
            emailError.classList.remove('show');
            messageError.classList.remove('show');
            nameError.textContent = '';
            emailError.textContent = '';
            messageError.textContent = '';

            // Validate name
            if (!nameInput.value.trim()) {
                nameError.textContent = 'Name is required';
                nameError.classList.add('show');
                hasError = true;
            } else if (nameInput.value.trim().length < 2) {
                nameError.textContent = 'Name must be at least 2 characters';
                nameError.classList.add('show');
                hasError = true;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                emailError.textContent = 'Email is required';
                emailError.classList.add('show');
                hasError = true;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                emailError.textContent = 'Please enter a valid email';
                emailError.classList.add('show');
                hasError = true;
            }

            // Validate message
            if (!messageInput.value.trim()) {
                messageError.textContent = 'Message is required';
                messageError.classList.add('show');
                hasError = true;
            } else if (messageInput.value.trim().length < 10) {
                messageError.textContent = 'Message must be at least 10 characters';
                messageError.classList.add('show');
                hasError = true;
            }

            if (!hasError) {
                contactSuccess.textContent = 'Message sent successfully!';
                contactSuccess.classList.remove('hidden');
                contactForm.reset();
                setTimeout(() => {
                    contactSuccess.classList.add('hidden');
                }, 3000);
            }
        });

        // Newsletter form submission
        const newsletterForm = document.querySelector('#newsletter-form');
        const newsletterSuccess = document.querySelector('#newsletter-success');
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            newsletterSuccess.textContent = 'Thank you for subscribing!';
            newsletterSuccess.classList.remove('hidden');
            newsletterForm.reset();
            setTimeout(() => {
                newsletterSuccess.classList.add('hidden');
            }, 3000);
        });

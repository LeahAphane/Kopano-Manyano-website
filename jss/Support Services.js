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

        // Slider Functionality
        let currentSlide = 0;
        const slides = document.querySelectorAll('.et_pb_slide');
        const totalSlides = slides.length;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('et-pb-active-slide'));
            slides[index].classList.add('et-pb-active-slide');
        }

        function nextSlide(event) {
            event.preventDefault();
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function prevSlide(event) {
            event.preventDefault();
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }

        setInterval(nextSlide, 7000);
        showSlide(currentSlide);

        // Form Validation
        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function validatePhone(phone) {
            return /^\+?\d{10,}$/.test(phone.replace(/\s/g, ''));
        }

        function showError(input, errorElement, message) {
            if (input && errorElement) {
                input.classList.add('border-red-500');
                errorElement.classList.remove('hidden');
                errorElement.textContent = message;
            }
        }

        function clearError(input, errorElement) {
            if (input && errorElement) {
                input.classList.remove('border-red-500');
                errorElement.classList.add('hidden');
            }
        }

        // Donation Form
        const donationForm = document.getElementById('donation-form');
        if (donationForm) {
            const amountSelect = donationForm.amount;
            const customAmountInput = donationForm['custom-amount'];
            const customAmountSection = customAmountInput.parentElement;

            amountSelect.addEventListener('change', () => {
                customAmountSection.classList.toggle('hidden', amountSelect.value !== 'custom');
                if (amountSelect.value !== 'custom') customAmountInput.value = '';
            });

            donationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = donationForm.name.value.trim();
                const email = donationForm.email.value.trim();
                let amount = amountSelect.value;
                let isValid = true;

                if (!name) {
                    showError(donationForm.name, document.getElementById('name-error'), 'Please enter your full name.');
                    isValid = false;
                } else {
                    clearError(donationForm.name, document.getElementById('name-error'));
                }

                if (!validateEmail(email)) {
                    showError(donationForm.email, document.getElementById('email-error'), 'Please enter a valid email address.');
                    isValid = false;
                } else {
                    clearError(donationForm.email, document.getElementById('email-error'));
                }

                if (!amount) {
                    showError(amountSelect, document.getElementById('amount-error'), 'Please select a donation amount.');
                    isValid = false;
                } else {
                    clearError(amountSelect, document.getElementById('amount-error'));
                }

                if (amount === 'custom') {
                    amount = customAmountInput.value.trim();
                    if (!amount || isNaN(amount) || amount <= 0) {
                        showError(customAmountInput, document.getElementById('custom-amount-error'), 'Please enter a valid donation amount.');
                        isValid = false;
                    } else {
                        clearError(customAmountInput, document.getElementById('custom-amount-error'));
                    }
                }

                if (isValid) {
                    const success = document.getElementById('donation-success');
                    if (success) {
                        success.textContent = `Thank you, ${name}! Your donation of R${amount} will make a profound impact. Confirmation sent to ${email}.`;
                        success.classList.remove('hidden');
                    }
                    donationForm.reset();
                    customAmountSection.classList.add('hidden');
                }
            });
        }

        // Volunteer Form
        const volunteerForm = document.getElementById('volunteer-form');
        if (volunteerForm) {
            volunteerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = volunteerForm.name.value.trim();
                const email = volunteerForm.email.value.trim();
                const phone = volunteerForm.phone.value.trim();
                let isValid = true;

                if (!name) {
                    showError(volunteerForm.name, document.getElementById('volunteer-name-error'), 'Please enter your full name.');
                    isValid = false;
                } else {
                    clearError(volunteerForm.name, document.getElementById('volunteer-name-error'));
                }

                if (!validateEmail(email)) {
                    showError(volunteerForm.email, document.getElementById('volunteer-email-error'), 'Please enter a valid email address.');
                    isValid = false;
                } else {
                    clearError(volunteerForm.email, document.getElementById('volunteer-email-error'));
                }

                if (!validatePhone(phone)) {
                    showError(volunteerForm.phone, document.getElementById('phone-error'), 'Please enter a valid phone number.');
                    isValid = false;
                } else {
                    clearError(volunteerForm.phone, document.getElementById('phone-error'));
                }

                if (isValid) {
                    const success = document.getElementById('volunteer-success');
                    if (success) {
                        success.textContent = `Welcome aboard, ${name}! We’ll contact you at ${email} or ${phone} soon.`;
                        success.classList.remove('hidden');
                    }
                    volunteerForm.reset();
                }
            });
        }

        // Newsletter Form
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
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('#nav-menu');
    const servicesButton = document.querySelector('.services-nav-item button');
    const servicesDropdown = document.querySelector('#services-dropdown');
    const themeToggle = document.querySelector('.theme-toggle');
    const chatWidget = document.querySelector('.chat-widget');
    const chatBox = document.querySelector('#chat-box');
    const faqItems = document.querySelectorAll('.faq-item');
    const volunteerForm = document.querySelector('#volunteer-form');
    const formInputs = volunteerForm?.querySelectorAll('input, select');
    const formProgress = document.querySelector('#form-progress');
    const csrfTokenInput = document.querySelector('#csrf_token');

    // Fetch CSRF token
    if (csrfTokenInput) {
        fetch('/My%20Website/php/get_csrf_token.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`CSRF fetch failed: HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.csrf_token) {
                    csrfTokenInput.value = data.csrf_token;
                    console.log('CSRF token set:', data.csrf_token);
                } else {
                    throw new Error('No CSRF token in response');
                }
            })
            .catch(error => {
                console.error('CSRF token fetch error:', error);
                if (volunteerForm) {
                    const responseDiv = document.querySelector('#form-response');
                    responseDiv.className = 'mt-4 text-center font-medium text-red-600';
                    responseDiv.textContent = 'Failed to load CSRF token. Please refresh the page.';
                    setTimeout(() => responseDiv.textContent = '', 5000);
                }
            });
    }

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
            hamburger.setAttribute('aria-expanded', !navMenu.classList.contains('hidden'));
        });
    }

    // Services dropdown toggle
    if (servicesButton && servicesDropdown) {
        servicesButton.addEventListener('click', () => {
            servicesDropdown.classList.toggle('hidden');
            servicesButton.setAttribute('aria-expanded', !servicesDropdown.classList.contains('hidden'));
        });
        document.addEventListener('click', (e) => {
            if (!servicesButton.contains(e.target) && !servicesDropdown.contains(e.target)) {
                servicesDropdown.classList.add('hidden');
                servicesButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
                themeToggle.setAttribute('aria-label', document.documentElement.classList.contains('dark') ? 'Toggle light theme' : 'Toggle dark theme');
            }
        });
    }

    // Chat widget toggle
    if (chatWidget && chatBox) {
        chatWidget.addEventListener('click', () => {
            chatBox.classList.toggle('hidden');
        });
    }

    // Chat button responses
    if (chatBox) {
        chatBox.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const action = e.target.getAttribute('data-action');
                const response = document.querySelector('#chat-response');
                if (response) {
                    const responses = {
                        donate: 'Visit our Donate page or email kopanomanyano51@gmail.com.',
                        volunteer: 'Fill out the form above to join our volunteer team!',
                        contact: 'Reach us at +27 12 345 6789 or kopanomanyano51@gmail.com.'
                    };
                    response.textContent = responses[action] || 'Sorry, something went wrong.';
                }
            }
        });
    }

    // FAQ accordion
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');
        if (header && content) {
            const toggleFAQ = () => {
                item.classList.toggle('active');
                content.classList.toggle('hidden');
                header.setAttribute('aria-expanded', item.classList.contains('active'));
            };
            header.addEventListener('click', toggleFAQ);
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFAQ();
                }
            });
        }
    });

    // Smooth scrolling
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Form validation
    window.validateInput = function(input) {
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (!errorMessage) return;

        if (input.id === 'volunteer-name') {
            errorMessage.textContent = input.value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
        } else if (input.id === 'volunteer-email') {
            errorMessage.textContent = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value) ? 'Invalid email format' : '';
        } else if (input.id === 'volunteer-phone') {
            errorMessage.textContent = !/^[0-9]{10}$/.test(input.value) ? 'Phone number must be exactly 10 digits' : '';
        } else if (input.id === 'volunteer-role') {
            errorMessage.textContent = !input.value ? 'Please select a role' : '';
        }

        errorMessage.classList.toggle('hidden', !errorMessage.textContent);
        updateProgress();
    };

    // Form progress bar
    function updateProgress() {
        if (!formInputs || !formProgress) return;
        let filled = 0;
        formInputs.forEach(input => {
            if (input.value.trim() && !input.parentElement.querySelector('.error-message')?.textContent) {
                filled++;
            }
        });
        const progress = (filled / formInputs.length) * 100;
        formProgress.style.width = `${progress}%`;
    }

    // Initialize progress bar
    if (formInputs) {
        formInputs.forEach(input => {
            input.addEventListener('input', () => validateInput(input));
        });
        updateProgress();
    }

    // Form submission
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            const responseDiv = document.querySelector('#form-response');

            // Validate all inputs
            let isValid = true;
            formInputs.forEach(input => {
                validateInput(input);
                if (input.parentElement.querySelector('.error-message')?.textContent) {
                    isValid = false;
                }
            });

            if (!isValid) {
                responseDiv.className = 'mt-4 text-center font-medium text-red-600';
                responseDiv.textContent = 'Please fix the errors above.';
                setTimeout(() => responseDiv.textContent = '', 5000);
                return;
            }

            // Log form data
            const formDataObj = Object.fromEntries(formData);
            console.log('Submitting form data:', formDataObj);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${result.message || 'No message'}`);
                }

                responseDiv.className = `mt-4 text-center font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`;
                responseDiv.textContent = result.message;

                if (result.success) {
                    form.reset();
                    if (formProgress) formProgress.style.width = '0%';
                    formInputs.forEach(input => {
                        const errorMessage = input.parentElement.querySelector('.error-message');
                        if (errorMessage) errorMessage.classList.add('hidden');
                    });
                }
            } catch (error) {
                console.error('Form submission error:', error);
                responseDiv.className = 'mt-4 text-center font-medium text-red-600';
                responseDiv.textContent = `Submission failed: ${error.message}`;
                setTimeout(() => responseDiv.textContent = '', 5000);
            }
        });
    }

    // Header shrink on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('#main-header');
        if (header) {
            header.classList.toggle('header-shrink', window.scrollY > 50);
        }
    });
});
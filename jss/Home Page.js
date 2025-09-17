document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('#nav-menu');
    const servicesButton = document.querySelector('.services-nav-item button');
    const servicesDropdown = document.querySelector('#services-dropdown');
    const themeToggle = document.querySelector('.theme-toggle');
    const chatWidget = document.querySelector('.chat-widget');
    const chatBox = document.querySelector('#chat-box');
    const chatClose = document.querySelector('.chat-close');
    const donationForm = document.querySelector('#donation-form');
    const volunteerForm = document.querySelector('#volunteer-form');
    const contactForm = document.querySelector('#contact-form');
    const donationInputs = donationForm?.querySelectorAll('input, select');
    const volunteerInputs = volunteerForm?.querySelectorAll('input');
    const contactInputs = contactForm?.querySelectorAll('input, textarea');
    const carouselImages = document.querySelectorAll('.carousel-image');
    const sliderContainer = document.querySelector('.slider-container');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const lightbox = document.querySelector('#lightbox');
    const lightboxImage = document.querySelector('#lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Fetch CSRF token
    const csrfInputs = document.querySelectorAll('input[name="csrf_token"]');
    if (csrfInputs.length) {
        fetch('/My%20Website/php/get_csrf_token.php')
            .then(response => {
                if (!response.ok) throw new Error(`CSRF fetch failed: HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (data.csrf_token) {
                    csrfInputs.forEach(input => input.value = data.csrf_token);
                    console.log('CSRF token set:', data.csrf_token);
                } else {
                    throw new Error('No CSRF token in response');
                }
            })
            .catch(error => {
                console.error('CSRF token fetch error:', error);
                const forms = [donationForm, volunteerForm, contactForm];
                forms.forEach(form => {
                    if (form) {
                        const successDiv = form.querySelector('.success-message');
                        successDiv.className = 'success-message bg-red-500 text-white p-3 rounded-md';
                        successDiv.textContent = 'Failed to load CSRF token. Please refresh the page.';
                        setTimeout(() => successDiv.textContent = '', 5000);
                    }
                });
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
        chatWidget.addEventListener('click', () => chatBox.classList.toggle('hidden'));
        if (chatClose) {
            chatClose.addEventListener('click', () => chatBox.classList.add('hidden'));
        }
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

    // Carousel for hero section
    if (carouselImages.length) {
        let currentIndex = 0;
        const changeImage = () => {
            carouselImages.forEach(img => img.classList.remove('opacity-100'));
            carouselImages.forEach(img => img.classList.add('opacity-0'));
            carouselImages[currentIndex].classList.add('opacity-100');
            currentIndex = (currentIndex + 1) % carouselImages.length;
        };
        setInterval(changeImage, 5000);
        changeImage();
    }

    // Success stories slider
    if (sliderContainer && prevBtn && nextBtn) {
        let slideIndex = 0;
        const slides = sliderContainer.querySelectorAll('.slide');
        const totalSlides = slides.length;

        const updateSlider = () => {
            const offset = -slideIndex * 100;
            sliderContainer.style.transform = `translateX(${offset}%)`;
        };

        prevBtn.addEventListener('click', () => {
            slideIndex = slideIndex > 0 ? slideIndex - 1 : totalSlides - 1;
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            slideIndex = slideIndex < totalSlides - 1 ? slideIndex + 1 : 0;
            updateSlider();
        });
    }

    // Stories carousel
    window.scrollCarousel = function(direction) {
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            const cardWidth = document.querySelector('.story-card').offsetWidth + 24; // Include margin
            carousel.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
        }
    };

    // Lightbox functionality
    if (lightbox && lightboxClose && lightboxImage) {
        document.querySelectorAll('.success-slider img').forEach(img => {
            img.addEventListener('click', () => {
                lightboxImage.src = img.src;
                lightbox.classList.remove('hidden');
            });
        });
        lightboxClose.addEventListener('click', () => lightbox.classList.add('hidden'));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.add('hidden');
        });
    }

    // Form validation
    window.validateInput = function(input, formType) {
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (!errorMessage) return;

        errorMessage.textContent = '';
        errorMessage.classList.add('hidden');

        if (formType === 'donation') {
            if (input.id === 'donation-name') {
                errorMessage.textContent = input.value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
            } else if (input.id === 'donation-email') {
                errorMessage.textContent = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value) ? 'Invalid email format' : '';
            } else if (input.id === 'donation-amount') {
                errorMessage.textContent = !input.value ? 'Please select an amount' : '';
                const customInput = document.querySelector('#custom-amount');
                customInput.classList.toggle('hidden', input.value !== 'custom');
                if (input.value === 'custom' && customInput.value <= 0) {
                    customInput.parentElement.querySelector('.error-message').textContent = 'Custom amount must be greater than 0';
                }
            } else if (input.id === 'custom-amount' && !input.classList.contains('hidden')) {
                errorMessage.textContent = input.value <= 0 ? 'Custom amount must be greater than 0' : '';
            }
        } else if (formType === 'volunteer') {
            if (input.id === 'volunteer-name') {
                errorMessage.textContent = input.value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
            } else if (input.id === 'volunteer-email') {
                errorMessage.textContent = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value) ? 'Invalid email format' : '';
            } else if (input.id === 'volunteer-phone') {
                errorMessage.textContent = !/^[0-9]{10}$/.test(input.value) ? 'Phone number must be exactly 10 digits' : '';
            }
        } else if (formType === 'contact') {
            if (input.id === 'contact-name') {
                errorMessage.textContent = input.value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
            } else if (input.id === 'contact-email') {
                errorMessage.textContent = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value) ? 'Invalid email format' : '';
            } else if (input.id === 'contact-message') {
                errorMessage.textContent = input.value.trim().length < 10 ? 'Message must be at least 10 characters' : '';
            }
        }

        errorMessage.classList.toggle('hidden', !errorMessage.textContent);
    };

    // Generic form submission handler
    const handleFormSubmit = async (form, inputs, formType) => {
        if (!form) return;
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const successDiv = form.querySelector('.success-message');

            // Validate all inputs
            let isValid = true;
            inputs.forEach(input => {
                validateInput(input, formType);
                if (input.parentElement.querySelector('.error-message')?.textContent) {
                    isValid = false;
                }
            });

            if (!isValid) {
                successDiv.className = 'success-message bg-red-500 text-white p-3 rounded-md';
                successDiv.textContent = 'Please fix the errors above.';
                setTimeout(() => successDiv.textContent = '', 5000);
                return;
            }

            // Log form data
            console.log(`Submitting ${formType} form data:`, Object.fromEntries(formData));

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${result.message || 'No message'}`);
                }

                successDiv.className = `success-message bg-${result.success ? 'green' : 'red'}-500 text-white p-3 rounded-md`;
                successDiv.textContent = result.message;

                if (result.success) {
                    form.reset();
                    inputs.forEach(input => {
                        const errorMessage = input.parentElement.querySelector('.error-message');
                        if (errorMessage) errorMessage.classList.add('hidden');
                    });
                }
            } catch (error) {
                console.error(`${formType} form submission error:`, error);
                successDiv.className = 'success-message bg-red-500 text-white p-3 rounded-md';
                successDiv.textContent = `Submission failed: ${error.message}`;
            }

            setTimeout(() => successDiv.textContent = '', 5000);
        });

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('input', () => validateInput(input, formType));
        });
    };

    // Initialize form handlers
    handleFormSubmit(donationForm, donationInputs, 'donation');
    handleFormSubmit(volunteerForm, volunteerInputs, 'volunteer');
    handleFormSubmit(contactForm, contactInputs, 'contact');
});
// Donation progress bar
fetch('/My%20Website/php/get_donation_progress.php')
    .then(response => response.json())
    .then(data => {
        const progressBar = document.querySelector('#progress-bar');
        const progressText = document.querySelector('#progress-text');
        if (data.success) {
            const percentage = Math.min((data.total / 50000) * 100, 100);
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `R${data.total.toFixed(2)} raised of R50,000`;
        } else {
            progressText.textContent = 'Error loading progress';
        }
    })
    .catch(error => console.error('Progress fetch error:', error));
    // Upcoming events
fetch('/My%20Website/php/get_events.php')
    .then(response => response.json())
    .then(data => {
        const eventsContainer = document.querySelector('#events-container');
        if (data.success && data.events.length) {
            eventsContainer.innerHTML = data.events.map(event => `
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold text-[var(--primary-color)]">${event.title}</h3>
                    <p class="text-gray-600 mt-2">${event.description}</p>
                    <p class="mt-2"><strong>Date:</strong> ${event.event_date}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                </div>
            `).join('');
        } else {
            eventsContainer.innerHTML = '<p class="text-center">No upcoming events.</p>';
        }
    })
    .catch(error => console.error('Events fetch error:', error));

    // Testimonials carousel
window.scrollTestimonials = function(direction) {
    const carousel = document.querySelector('#testimonials-carousel');
    const slides = document.querySelectorAll('.testimonial-slide');
    const slideWidth = slides[0].offsetWidth;
    carousel.scrollBy({ left: direction * slideWidth, behavior: 'smooth' });
};

// Newsletter form
const newsletterForm = document.querySelector('#newsletter-form');
const newsletterInputs = newsletterForm?.querySelectorAll('input');
handleFormSubmit(newsletterForm, newsletterInputs, 'newsletter');

// Update validateInput for newsletter
window.validateInput = function(input, formType) {
    const errorMessage = input.parentElement.querySelector('.error-message');
    if (!errorMessage) return;

    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');

    if (formType === 'newsletter') {
        if (input.id === 'newsletter-email') {
            errorMessage.textContent = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value) ? 'Invalid email format' : '';
        }
    } else {
        // Existing validation logic for other forms
        if (formType === 'donation') { /* ... */ }
        else if (formType === 'volunteer') { /* ... */ }
        else if (formType === 'contact') { /* ... */ }
    }

    errorMessage.classList.toggle('hidden', !errorMessage.textContent);
};

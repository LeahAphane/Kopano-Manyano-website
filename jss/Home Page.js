// Home Page.js - Fixed and Integrated (Pure JS - Use window globals for PHP vars)
document.addEventListener('DOMContentLoaded', function() {
    // Use global variables set from inline PHP script in HTML
    const userId = window.userId || null;
    const isLoggedIn = window.isLoggedIn || false;

    // DOM elements
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('#nav-menu');
    const servicesButton = document.querySelector('.services-nav-item button');
    const servicesDropdown = document.querySelector('#services-dropdown');
    const themeToggle = document.querySelector('.theme-toggle');
    const chatWidget = document.querySelector('.chat-widget');
    const chatBox = document.querySelector('#chat-box');
    const chatClose = document.querySelector('.chat-close');
    const sendMessage = document.querySelector('#send-message');
    const chatInput = document.querySelector('#chat-input');
    const chatMessages = document.querySelector('#chat-messages');
    const contactForm = document.querySelector('#contact-form');
    const contactInputs = contactForm ? contactForm.querySelectorAll('input, textarea') : [];
    const newsletterForm = document.querySelector('#newsletter-form');
    const newsletterInputs = newsletterForm ? newsletterForm.querySelectorAll('input') : [];
    const carouselImages = document.querySelectorAll('.carousel-image');
    const sliderContainer = document.querySelector('.slider-container');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const lightbox = document.querySelector('#lightbox');
    const lightboxImage = document.querySelector('#lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Fetch CSRF token
    const csrfInputs = document.querySelectorAll('input[name="csrf_token"]');
    if (csrfInputs.length > 0) {
        fetch('/My%20Website/php/get_csrf_token.php')
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('CSRF fetch failed: HTTP ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                if (data.csrf_token) {
                    csrfInputs.forEach(function(input) {
                        input.value = data.csrf_token;
                    });
                    console.log('CSRF token set:', data.csrf_token);
                } else {
                    throw new Error('No CSRF token in response');
                }
            })
            .catch(function(error) {
                console.error('CSRF token fetch error:', error);
                const forms = [contactForm, newsletterForm];
                forms.forEach(function(form) {
                    if (form) {
                        const successDiv = form.querySelector('.success-message');
                        if (successDiv) {
                            successDiv.className = 'success-message bg-red-500 text-white p-3 rounded-md';
                            successDiv.textContent = 'Failed to load CSRF token. Please refresh the page.';
                            setTimeout(function() { successDiv.textContent = ''; }, 5000);
                        }
                    }
                });
            });
    }

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('hidden');
            hamburger.setAttribute('aria-expanded', !navMenu.classList.contains('hidden'));
        });
    }

    // Services dropdown toggle
    if (servicesButton && servicesDropdown) {
        servicesButton.addEventListener('click', function() {
            servicesDropdown.classList.toggle('hidden');
            servicesButton.setAttribute('aria-expanded', !servicesDropdown.classList.contains('hidden'));
        });
        document.addEventListener('click', function(e) {
            if (!servicesButton.contains(e.target) && !servicesDropdown.contains(e.target)) {
                servicesDropdown.classList.add('hidden');
                servicesButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.documentElement.classList.toggle('dark');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
                themeToggle.setAttribute('aria-label', document.documentElement.classList.contains('dark') ? 'Toggle light theme' : 'Toggle dark theme');
            }
        });
    }

    // AI Chat functionality
    if (chatWidget && chatBox) {
        // If not logged in, disable full chat
        if (!isLoggedIn) {
            const welcomeMsg = chatMessages ? chatMessages.querySelector('.message') : null;
            if (welcomeMsg) {
                welcomeMsg.innerHTML = '<strong>AI:</strong> Hello! To chat fully, please log in or sign up. Meanwhile, ask about our services!';
            }
            if (sendMessage) {
                sendMessage.disabled = true;
                sendMessage.textContent = 'Login Required';
            }
        } else {
            // Toggle chat box
            chatWidget.addEventListener('click', function() {
                chatBox.classList.toggle('hidden');
            });

            if (chatClose) {
                chatClose.addEventListener('click', function() {
                    chatBox.classList.add('hidden');
                });
            }

            // Send message
            if (sendMessage) {
                sendMessage.addEventListener('click', sendChatMessage);
            }
            if (chatInput) {
                chatInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        sendChatMessage();
                    }
                });
            }

            function sendChatMessage() {
                const message = chatInput ? chatInput.value.trim() : '';
                if (!message) return;

                // Add user message
                addMessage('user', message);
                if (chatInput) {
                    chatInput.value = '';
                }

                // Show loading
                const loadingMsg = addMessage('bot', 'Typing...');

                // Send to API
                fetch('/My%20Website/php/chat_api.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: message, user_id: userId })
                })
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    if (loadingMsg) loadingMsg.parentNode.removeChild(loadingMsg);
                    addMessage('bot', data.response || 'No response received.');
                })
                .catch(function(error) {
                    if (loadingMsg) loadingMsg.parentNode.removeChild(loadingMsg);
                    addMessage('bot', 'Sorry, I encountered an error. Please try again.');
                    console.error('Chat error:', error);
                });
            }

            function addMessage(sender, text) {
                if (!chatMessages) return null;
                const div = document.createElement('div');
                div.className = 'message ' + (sender === 'user' ? 'user-message bg-gray-200 text-right' : 'bot-message bg-blue-100') + ' p-2 rounded';
                div.innerHTML = '<strong>' + (sender === 'user' ? 'You' : 'AI') + ':</strong> ' + text;
                chatMessages.appendChild(div);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                return sender === 'bot' ? div : null;
            }
        }
    }

    // Carousel for hero section
    if (carouselImages.length > 0) {
        let currentIndex = 0;
        const changeImage = function() {
            carouselImages.forEach(function(img) { 
                img.classList.remove('opacity-100'); 
            });
            carouselImages.forEach(function(img) { 
                img.classList.add('opacity-0'); 
            });
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

        const updateSlider = function() {
            const offset = -slideIndex * 100;
            sliderContainer.style.transform = 'translateX(' + offset + '%)';
        };

        prevBtn.addEventListener('click', function() {
            slideIndex = slideIndex > 0 ? slideIndex - 1 : totalSlides - 1;
            updateSlider();
        });

        nextBtn.addEventListener('click', function() {
            slideIndex = slideIndex < totalSlides - 1 ? slideIndex + 1 : 0;
            updateSlider();
        });
    }

    // Stories carousel
    window.scrollCarousel = function(direction) {
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            const cardWidth = document.querySelector('.story-card') ? document.querySelector('.story-card').offsetWidth + 24 : 0; // Include margin
            carousel.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
        }
    };

    // Lightbox functionality
    if (lightbox && lightboxClose && lightboxImage) {
        const sliderImages = document.querySelectorAll('.success-slider img');
        sliderImages.forEach(function(img) {
            img.addEventListener('click', function() {
                lightboxImage.src = img.src;
                lightbox.classList.remove('hidden');
            });
        });
        lightboxClose.addEventListener('click', function() { 
            lightbox.classList.add('hidden'); 
        });
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) lightbox.classList.add('hidden');
        });
    }

    // Form validation function (updated for existing forms)
    window.validateInput = function(input, formType) {
        const errorMessage = input.parentElement ? input.parentElement.querySelector('.error-message') : null;
        if (!errorMessage) return;

        errorMessage.textContent = '';
        errorMessage.classList.add('hidden');

        if (formType === 'contact') {
            if (input.id === 'contact-name') {
                errorMessage.textContent = input.value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
            } else if (input.id === 'contact-email') {
                errorMessage.textContent = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value) ? 'Invalid email format' : '';
            } else if (input.id === 'contact-message') {
                errorMessage.textContent = input.value.trim().length < 10 ? 'Message must be at least 10 characters' : '';
            }
        } else if (formType === 'newsletter') {
            if (input.id === 'newsletter-email') {
                errorMessage.textContent = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value) ? 'Invalid email format' : '';
            }
        }

        if (errorMessage.textContent) {
            errorMessage.classList.remove('hidden');
        }
    };

    // Generic form submission handler
    const handleFormSubmit = function(form, inputs, formType) {
        if (!form) return;
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(form);
            const successDiv = form.querySelector('.success-message');

            // Validate all inputs
            let isValid = true;
            inputs.forEach(function(input) {
                validateInput(input, formType);
                const errMsg = input.parentElement ? input.parentElement.querySelector('.error-message') : null;
                if (errMsg && errMsg.textContent) {
                    isValid = false;
                }
            });

            if (!isValid) {
                if (successDiv) {
                    successDiv.className = 'success-message bg-red-500 text-white p-3 rounded-md';
                    successDiv.textContent = 'Please fix the errors above.';
                    setTimeout(function() { successDiv.textContent = ''; }, 5000);
                }
                return;
            }

            // Log form data
            console.log('Submitting ' + formType + ' form data:', Object.fromEntries(formData));

            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(function(response) { return response.json(); })
            .then(function(result) {
                if (successDiv) {
                    successDiv.className = 'success-message bg-' + (result.success ? 'green' : 'red') + '-500 text-white p-3 rounded-md';
                    successDiv.textContent = result.message;

                    if (result.success) {
                        form.reset();
                        inputs.forEach(function(input) {
                            const errorMessage = input.parentElement ? input.parentElement.querySelector('.error-message') : null;
                            if (errorMessage) errorMessage.classList.add('hidden');
                        });
                    }
                }
            })
            .catch(function(error) {
                console.error(formType + ' form submission error:', error);
                if (successDiv) {
                    successDiv.className = 'success-message bg-red-500 text-white p-3 rounded-md';
                    successDiv.textContent = 'Submission failed: ' + error.message;
                }
            });

            if (successDiv) {
                setTimeout(function() { successDiv.textContent = ''; }, 5000);
            }
        });

        // Real-time validation
        inputs.forEach(function(input) {
            input.addEventListener('input', function() { validateInput(input, formType); });
        });
    };

    // Initialize form handlers
    handleFormSubmit(contactForm, contactInputs, 'contact');
    handleFormSubmit(newsletterForm, newsletterInputs, 'newsletter');

    // Donation progress bar
    fetch('/My%20Website/php/get_donation_progress.php')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            const progressBar = document.querySelector('#progress-bar');
            const progressText = document.querySelector('#progress-text');
            if (data.success && progressBar && progressText) {
                const percentage = Math.min((data.total / 50000) * 100, 100);
                progressBar.style.width = percentage + '%';
                progressText.textContent = 'R' + data.total.toFixed(2) + ' raised of R50,000';
            } else if (progressText) {
                progressText.textContent = 'Error loading progress';
            }
        })
        .catch(function(error) { console.error('Progress fetch error:', error); });

    // Upcoming events
    fetch('/My%20Website/php/get_events.php')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            const eventsContainer = document.querySelector('#events-container');
            if (eventsContainer) {
                if (data.success && data.events && data.events.length > 0) {
                    eventsContainer.innerHTML = data.events.map(function(event) {
                        return `
                            <div class="bg-white p-6 rounded-lg shadow-md">
                                <h3 class="text-xl font-semibold text-[var(--primary-color)]">${event.title}</h3>
                                <p class="text-gray-600 mt-2">${event.description}</p>
                                <p class="mt-2"><strong>Date:</strong> ${event.event_date}</p>
                                <p><strong>Location:</strong> ${event.location}</p>
                            </div>
                        `;
                    }).join('');
                } else {
                    eventsContainer.innerHTML = '<p class="text-center">No upcoming events.</p>';
                }
            }
        })
        .catch(function(error) { console.error('Events fetch error:', error); });

    // Testimonials carousel
    window.scrollTestimonials = function(direction) {
        const carousel = document.querySelector('#testimonials-carousel');
        const slides = document.querySelectorAll('.testimonial-slide');
        if (carousel && slides.length > 0) {
            const slideWidth = slides[0].offsetWidth;
            carousel.scrollBy({ left: direction * slideWidth, behavior: 'smooth' });
        }
    };
});
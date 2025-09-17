
        document.addEventListener('DOMContentLoaded', () => {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            const servicesButton = document.querySelector('.services-nav-item button');
            const servicesDropdown = document.querySelector('.services-dropdown');
            const themeToggle = document.querySelector('.theme-toggle');
            const chatWidget = document.querySelector('.chat-widget');
            const chatBox = document.querySelector('.chat-box');
            const accordionHeaders = document.querySelectorAll('.accordion-header');

            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('open');
                hamburger.setAttribute('aria-expanded', navMenu.classList.contains('open'));
            });

            servicesButton.addEventListener('click', () => {
                servicesDropdown.classList.toggle('open');
                servicesButton.setAttribute('aria-expanded', servicesDropdown.classList.contains('open'));
            });

            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                const icon = themeToggle.querySelector('i');
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            });

            chatWidget.addEventListener('click', () => {
                chatBox.classList.toggle('hidden');
            });

            chatBox.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    const action = e.target.getAttribute('data-action');
                    const response = document.querySelector('#chat-response');
                    response.textContent = {
                        donate: 'To donate, visit our Donate page or email info@kopanomanyano.org.',
                        volunteer: 'Visit our Volunteer page to sign up!',
                        contact: 'Reach us at +27 12 345 6789 or info@kopanomanyano.org.'
                    }[action] || '';
                }
            });

            accordionHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const content = header.nextElementSibling;
                    content.classList.toggle('open');
                    header.setAttribute('aria-expanded', content.classList.contains('open'));
                });
            });
        });
    
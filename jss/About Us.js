// Navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const servicesNavItem = document.querySelector('.services-nav-item');
    const servicesButton = servicesNavItem?.querySelector('button');
    const servicesDropdown = document.querySelector('.services-dropdown');

    // Hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
            const isExpanded = !navMenu.classList.contains('hidden');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });
    } else {
        console.warn('Hamburger or nav-menu not found');
    }

    // Services dropdown toggle
    if (!servicesDropdown || !servicesNavItem || !servicesButton) {
        console.warn('Services dropdown, nav item, or button not found');
        return;
    }

    // Ensure dropdown is hidden on load
    if (!servicesDropdown.classList.contains('hidden')) {
        servicesDropdown.classList.add('hidden');
    }
    servicesButton.setAttribute('aria-expanded', 'false');

    // Toggle dropdown visibility
    const toggleDropdown = (isOpen) => {
        servicesDropdown.classList.toggle('hidden', !isOpen);
        servicesButton.setAttribute('aria-expanded', isOpen);
    };

    // Click to toggle (for touch/mobile and keyboard)
    servicesButton.addEventListener('click', () => {
        toggleDropdown(!servicesDropdown.classList.contains('hidden'));
    });

    // Hover for desktop
    servicesNavItem.addEventListener('mouseenter', () => {
        toggleDropdown(true);
    });
    servicesNavItem.addEventListener('mouseleave', () => {
        toggleDropdown(false);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!servicesNavItem.contains(e.target) && !servicesDropdown.contains(e.target)) {
            toggleDropdown(false);
        }
    });

    // Keyboard navigation for button
    servicesButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown(!servicesDropdown.classList.contains('hidden'));
        } else if (e.key === 'Escape') {
            toggleDropdown(false);
            servicesButton.focus();
        }
    });

    // Navigate dropdown links
    const dropdownLinks = servicesDropdown.querySelectorAll('a');
    dropdownLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href) {
                window.location.href = href;
            } else {
                console.warn('Link href is empty or invalid:', link.textContent);
            }
        });
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href) {
                    window.location.href = href;
                } else {
                    console.warn('Link href is empty or invalid:', link.textContent);
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (index + 1) % dropdownLinks.length;
                dropdownLinks[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (index - 1 + dropdownLinks.length) % dropdownLinks.length;
                dropdownLinks[prevIndex].focus();
            } else if (e.key === 'Escape') {
                toggleDropdown(false);
                servicesButton.focus();
            }
        });
    });
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            themeToggle.innerHTML = document.body.classList.contains('dark-theme') 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        });
    }
}

// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length) {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            let current = 0;
            const increment = target / 100;
            const updateCounter = () => {
                current += increment;
                counter.textContent = Math.ceil(current);
                if (current < target) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        });
    }
}

// Staggered Animation for Team Cards
function initTeamCardAnimation() {
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach((card, index) => {
        card.style.setProperty('--order', index);
    });
}

// Modal Functionality
function initModals() {
    const modals = document.querySelectorAll('.modal');
    if (modals.length) {
        const openModal = (memberId) => {
            const modal = document.getElementById(`modal-${memberId}`);
            if (modal) {
                modal.classList.add('show');
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.focus();
                }
            }
        };

        const closeModal = (memberId) => {
            const modal = document.getElementById(`modal-${memberId}`);
            if (modal) {
                modal.classList.remove('show');
            }
        };

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => modal.classList.remove('show'));
            }
        });

        // Close modal when clicking outside
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });

        // Expose openModal and closeModal globally if needed
        window.openModal = openModal;
        window.closeModal = closeModal;
    }
}

// Initialize everything
window.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThemeToggle();
    initCounterAnimation();
    initTeamCardAnimation();
    initModals();
});
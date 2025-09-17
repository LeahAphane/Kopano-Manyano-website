document.addEventListener('DOMContentLoaded', () => {
    // Common UI Interactions
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const servicesButton = document.querySelector('.services-nav-item button');
    const servicesDropdown = document.querySelector('.services-dropdown');
    const themeToggle = document.querySelector('.theme-toggle');
    const chatWidget = document.querySelector('.chat-widget');
    const chatBox = document.querySelector('.chat-box');
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', navMenu.classList.contains('open'));
        });
    }

    if (servicesButton && servicesDropdown) {
        servicesButton.addEventListener('click', () => {
            servicesDropdown.classList.toggle('open');
            servicesButton.setAttribute('aria-expanded', servicesDropdown.classList.contains('open'));
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            }
        });
    }

    if (chatWidget && chatBox) {
        chatWidget.addEventListener('click', () => {
            chatBox.classList.toggle('hidden');
        });

        chatBox.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const action = e.target.getAttribute('data-action');
                const response = document.querySelector('#chat-response');
                if (response) {
                    response.textContent = {
                        donate: 'To donate, fill out the form or email helpus kopanomanyano51@gmail.com.',
                        volunteer: 'You are welcome to help in any way! Reach out to us.',
                        contact: 'Reach us at +27 87 265 1327 or helpus kopanomanyano51@gmail.com.'
                    }[action] || '';
                }
            }
        });
    }

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            if (content) {
                content.classList.toggle('open');
                header.setAttribute('aria-expanded', content.classList.contains('open'));
            }
        });
    });

    // Donation Form
    const donationForm = document.getElementById('donation-form');
    if (donationForm) {
        const elements = {
            donationAmount: document.getElementById('donation-amount'),
            customAmount: document.getElementById('custom-amount'),
            successMessage: document.getElementById('donation-success')
        };

        const fields = [
            { id: 'donation-name', errorId: 'name-error', message: 'Full name is required', validate: val => val.trim().length > 0 },
            { id: 'donation-email', errorId: 'email-error', message: 'Valid email is required', validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) },
            { id: 'donation-amount', errorId: 'amount-error', message: 'Please select an amount', validate: val => val !== '' }
        ];

        // Toggle custom amount input
        elements.donationAmount.addEventListener('change', () => {
            const isCustom = elements.donationAmount.value === 'custom';
            elements.customAmount.classList.toggle('hidden', !isCustom);
            elements.customAmount.required = isCustom;
            elements.customAmount.value = isCustom ? elements.customAmount.value : '';
            document.getElementById('custom-amount-error').classList.add('hidden');
        });

        // Form submission
        donationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let isValid = true;

            // Reset previous error states
            fields.forEach(({ errorId }) => {
                const error = document.getElementById(errorId);
                error.classList.add('hidden');
                error.textContent = '';
            });
            document.getElementById('custom-amount-error').classList.add('hidden');
            elements.successMessage.classList.add('hidden');

            // Validate fields
            fields.forEach(({ id, errorId, message, validate }) => {
                const input = document.getElementById(id);
                if (!input || !validate(input.value)) {
                    document.getElementById(errorId).textContent = message;
                    document.getElementById(errorId).classList.remove('hidden');
                    isValid = false;
                }
            });

            // Validate custom amount
            if (elements.donationAmount.value === 'custom') {
                const amountValue = parseFloat(elements.customAmount.value);
                if (isNaN(amountValue) || amountValue <= 0) {
                    document.getElementById('custom-amount-error').textContent = 'Please enter a valid amount';
                    document.getElementById('custom-amount-error').classList.remove('hidden');
                    isValid = false;
                }
            }

            if (isValid) {
                try {
                    // Simulate API call (replace with actual endpoint)
                    await new Promise(resolve => setTimeout(resolve, 500));
                    elements.successMessage.textContent = 'Donation successfully submitted!';
                    elements.successMessage.classList.remove('hidden');
                    donationForm.reset();
                    elements.customAmount.classList.add('hidden');
                    window.scrollTo({ top: elements.successMessage.offsetTop - 100, behavior: 'smooth' });
                } catch (error) {
                    elements.successMessage.textContent = 'An error occurred. Please try again.';
                    elements.successMessage.classList.remove('hidden');
                    elements.successMessage.style.backgroundColor = '#dc2626';
                }
            }

            // Accessibility: Focus first error on submit if invalid
            if (!isValid) {
                const firstError = document.querySelector('.error-message:not(.hidden)');
                if (firstError) {
                    const parentDiv = firstError.closest('div');
                    const relatedInput = parentDiv.querySelector('input, select');
                    if (relatedInput) {
                        relatedInput.focus();
                    }
                }
            }
        });

        // Real-time validation for better UX
        fields.forEach(({ id, errorId, message, validate }) => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    const error = document.getElementById(errorId);
                    if (input.value && !validate(input.value)) {
                        error.textContent = message;
                        error.classList.remove('hidden');
                    } else {
                        error.classList.add('hidden');
                    }
                });
            }
        });
    }

    // Debit Order Form
    const debitForm = document.getElementById('debit-order-form');
    if (debitForm) {
        const elements = {
            debitAmount: document.getElementById('debit-amount'),
            otherAmountContainer: document.getElementById('other-amount-container'),
            otherAmount: document.getElementById('other-amount'),
            successMessage: document.getElementById('debit-order-success')
        };

        const fields = [
            { id: 'first-name', errorId: 'first-name-error', message: 'First name is required', validate: val => val.trim().length > 0 },
            { id: 'last-name', errorId: 'last-name-error', message: 'Last name is required', validate: val => val.trim().length > 0 },
            { id: 'email', errorId: 'email-error', message: 'Valid email is required', validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) },
            { id: 'phone', errorId: 'phone-error', message: 'Valid phone number is required', validate: val => /^\+?\d{10,15}$/.test(val.replace(/\s/g, '')) },
            { id: 'bank', errorId: 'bank-error', message: 'Please select a bank', validate: val => val !== '' },
            { id: 'account-number', errorId: 'account-number-error', message: 'Valid account number is required', validate: val => /^\d{9,18}$/.test(val) },
            { id: 'branch-code', errorId: 'branch-code-error', message: 'Valid IFSC code is required', validate: val => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val) },
            { id: 'debit-amount', errorId: 'debit-amount-error', message: 'Please select an amount', validate: val => val !== '' }
        ];

        // Toggle other amount input
        elements.debitAmount.addEventListener('change', () => {
            const isOther = elements.debitAmount.value === 'other';
            elements.otherAmountContainer.classList.toggle('hidden', !isOther);
            elements.otherAmount.required = isOther;
            elements.otherAmount.value = isOther ? elements.otherAmount.value : '';
            document.getElementById('other-amount-error').classList.add('hidden');
        });

        // Form submission
        debitForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let isValid = true;

            // Reset previous error states
            fields.forEach(({ errorId }) => {
                const error = document.getElementById(errorId);
                error.classList.add('hidden');
                error.textContent = '';
            });
            document.getElementById('account-type-error').classList.add('hidden');
            document.getElementById('other-amount-error').classList.add('hidden');
            elements.successMessage.classList.add('hidden');

            // Validate fields
            fields.forEach(({ id, errorId, message, validate }) => {
                const input = document.getElementById(id);
                if (!input || !validate(input.value)) {
                    document.getElementById(errorId).textContent = message;
                    document.getElementById(errorId).classList.remove('hidden');
                    isValid = false;
                }
            });

            // Validate account type
            const accountType = document.querySelector('input[name="account-type"]:checked');
            if (!accountType) {
                document.getElementById('account-type-error').textContent = 'Please select an account type';
                document.getElementById('account-type-error').classList.remove('hidden');
                isValid = false;
            }

            // Validate other amount
            if (elements.debitAmount.value === 'other') {
                const amountValue = parseFloat(elements.otherAmount.value);
                if (isNaN(amountValue) || amountValue <= 0) {
                    document.getElementById('other-amount-error').textContent = 'Please enter a valid amount';
                    document.getElementById('other-amount-error').classList.remove('hidden');
                    isValid = false;
                }
            }

            if (isValid) {
                try {
                    // Simulate API call (replace with actual endpoint)
                    await new Promise(resolve => setTimeout(resolve, 500));
                    elements.successMessage.textContent = 'Debit order successfully set up!';
                    elements.successMessage.classList.remove('hidden');
                    debitForm.reset();
                    elements.otherAmountContainer.classList.add('hidden');
                    window.scrollTo({ top: elements.successMessage.offsetTop - 100, behavior: 'smooth' });
                } catch (error) {
                    elements.successMessage.textContent = 'An error occurred. Please try again.';
                    elements.successMessage.classList.remove('hidden');
                    elements.successMessage.style.backgroundColor = '#dc2626';
                }
            }

            // Accessibility: Focus first error on submit if invalid
            if (!isValid) {
                const firstError = document.querySelector('.error-message:not(.hidden)');
                if (firstError) {
                    const parentDiv = firstError.closest('div');
                    const relatedInput = parentDiv.querySelector('input, select, textarea');
                    if (relatedInput) {
                        relatedInput.focus();
                    }
                }
            }
        });

        // Real-time validation for better UX
        fields.forEach(({ id, errorId, message, validate }) => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    const error = document.getElementById(errorId);
                    if (input.value && !validate(input.value)) {
                        error.textContent = message;
                        error.classList.remove('hidden');
                    } else {
                        error.classList.add('hidden');
                    }
                });
            }
        });
    }
});
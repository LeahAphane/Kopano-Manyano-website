  // Hamburger Menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('hidden');
                hamburger.innerHTML = navMenu.classList.contains('hidden') ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
                hamburger.setAttribute('aria-expanded', !navMenu.classList.contains('hidden'));
            });
        }

        // Services Dropdown for Mobile
        const servicesMenu = document.querySelector('.services-menu');
        if (servicesMenu) {
            servicesMenu.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    servicesMenu.classList.toggle('active');
                }
            });
        }

        // Theme Toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            });
        }

        // Lazy Load Images
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.classList.add('loading');
            img.addEventListener('load', () => {
                img.classList.remove('loading');
                img.classList.add('loaded');
            });
        });

        // Gallery Filter
        const filterButtons = document.querySelectorAll('.gallery-nav button');
        const gallerySections = document.querySelectorAll('.gallery-section');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                gallerySections.forEach(section => {
                    const category = section.getAttribute('data-category');
                    if (filter === 'all' || filter === category) {
                        section.style.display = 'block';
                        setTimeout(() => {
                            section.classList.add('visible');
                            section.querySelectorAll('.gallery-item').forEach(item => {
                                item.classList.add('fade-in');
                            });
                        }, 10);
                    } else {
                        section.style.display = 'none';
                        section.classList.remove('visible');
                    }
                });
            });
        });

        // Intersection Observer for Section Visibility
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.querySelectorAll('.gallery-item').forEach(item => {
                        item.classList.add('fade-in');
                    });
                }
            });
        }, { threshold: 0.1 });

        gallerySections.forEach(section => observer.observe(section));

        // Lightbox Functionality
        const galleryItems = document.querySelectorAll('.gallery-item img');
        const lightbox = document.querySelector('.lightbox');
        const lightboxImage = document.querySelector('#lightbox-image');
        const lightboxCaption = document.querySelector('#lightbox-caption');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        let currentIndex = 0;

        if (lightbox && lightboxImage && lightboxCaption && lightboxClose && lightboxPrev && lightboxNext) {
            galleryItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    currentIndex = index;
                    openLightbox();
                });
            });

            function openLightbox() {
                lightboxImage.src = galleryItems[currentIndex].src;
                lightboxImage.alt = galleryItems[currentIndex].alt;
                lightboxCaption.textContent = galleryItems[currentIndex].getAttribute('data-caption') || '';
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            });

            lightboxPrev.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                lightboxImage.src = galleryItems[currentIndex].src;
                lightboxImage.alt = galleryItems[currentIndex].alt;
                lightboxCaption.textContent = galleryItems[currentIndex].getAttribute('data-caption') || '';
            });

            lightboxNext.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % galleryItems.length;
                lightboxImage.src = galleryItems[currentIndex].src;
                lightboxImage.alt = galleryItems[currentIndex].alt;
                lightboxCaption.textContent = galleryItems[currentIndex].getAttribute('data-caption') || '';
            });

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });

            // Keyboard Navigation for Lightbox
            document.addEventListener('keydown', (e) => {
                if (lightbox.classList.contains('active')) {
                    if (e.key === 'ArrowLeft') {
                        lightboxPrev.click();
                    } else if (e.key === 'ArrowRight') {
                        lightboxNext.click();
                    } else if (e.key === 'Escape') {
                        lightboxClose.click();
                    }
                }
            });
        }

        // Back to Top Button
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });
        }
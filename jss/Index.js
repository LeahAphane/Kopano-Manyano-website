 // Particle background
        const canvas = document.getElementById('particles');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray = [];
        const numberOfParticles = 100;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 5 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.2) this.size -= 0.1;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
                if (particlesArray[i].size <= 0.2) {
                    particlesArray.splice(i, 1);
                    i--;
                    particlesArray.push(new Particle());
                }
            }
            requestAnimationFrame(animate);
        }

        init();
        animate();

        // Mouse interaction
        canvas.addEventListener('mousemove', (e) => {
            for (let i = 0; i < particlesArray.length; i++) {
                const dx = e.x - particlesArray[i].x;
                const dy = e.y - particlesArray[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    particlesArray[i].speedX += dx / 100;
                    particlesArray[i].speedY += dy / 100;
                }
            }
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Audio toggle
        const audio = document.getElementById('bg-audio');
        const audioToggle = document.querySelector('.audio-toggle i');
        let isPlaying = false;

        function toggleAudio() {
            if (isPlaying) {
                audio.pause();
                audioToggle.classList.remove('fa-volume-up');
                audioToggle.classList.add('fa-volume-mute');
            } else {
                audio.play();
                audioToggle.classList.remove('fa-volume-mute');
                audioToggle.classList.add('fa-volume-up');
            }
            isPlaying = !isPlaying;
        }
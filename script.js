const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let width, height;
let particlesArray = [];
let mouse = {
    x: null,
    y: null,
    radius: 100,
    clicked: false
};

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resize();
    initParticles();
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.size = 1.5;
        this.color = '#1d1d1f'; // Deep Apple text color
        this.density = (Math.random() * 20) + 1;
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.08;
        this.friction = 0.9;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;

        if (distance < mouse.radius) {
            // Subtle repel effect, much smoother than before
            this.vx -= forceDirectionX * force * 5;
            this.vy -= forceDirectionY * force * 5;
        } else {
            this.vx += (this.baseX - this.x) * this.ease;
            this.vy += (this.baseY - this.y) * this.ease;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.friction;
        this.vy *= this.friction;
    }
}

function initParticles() {
    particlesArray = [];
    ctx.clearRect(0, 0, width, height);

    // Draw "Portfolio" elegantly
    let fontSize = Math.min(width * 0.1, 100);
    ctx.font = `600 ${fontSize}px -apple-system,SF Pro Display,Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Portfolio", width / 2, height / 2);

    const data = ctx.getImageData(0, 0, width, height);
    ctx.clearRect(0, 0, width, height);

    // Increase step for a "cleaner", less cluttered dot-matrix look
    let step = 6;
    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
            if (data.data[((y * width + x) * 4) + 3] > 128) {
                particlesArray.push(new Particle(x, y));
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

// GSAP Animations
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('h2, .section-sub, .project-card').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out"
        });
    });
}

resize();
initParticles();
animate();
initGSAP();

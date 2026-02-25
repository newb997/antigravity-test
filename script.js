const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let width, height;
let particlesArray = [];
let mouse = {
    x: null,
    y: null,
    radius: 150,
    clicked: false
};

// Initialize Canvas Size
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resize();
    initParticles();
});

// Interactivity
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mousedown', () => mouse.clicked = true);
window.addEventListener('mouseup', () => mouse.clicked = false);

class Particle {
    constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#00e5ff' : '#ff007f';
        this.density = (Math.random() * 30) + 10;
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.05;
        this.friction = 0.85;
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
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            let mult = mouse.clicked ? 15 : 2;
            this.vx -= directionX * mult;
            this.vy -= directionY * mult;
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
    ctx.clearRect(0,0,width,height);
    
    // Draw Text off-screen
    ctx.fillStyle = "white";
    let fontSize = Math.min(width * 0.12, 140);
    ctx.font = `900 ${fontSize}px Outfit`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PORTFOLIO", width / 2, height / 2);
    
    const data = ctx.getImageData(0, 0, width, height);
    ctx.clearRect(0,0,width,height);

    let step = width < 768 ? 4 : 5;
    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
            if (data.data[((y * width + x) * 4) + 3] > 128) {
                particlesArray.push(new Particle(x, y));
            }
        }
    }
}

function animate() {
    ctx.fillStyle = 'rgba(5, 5, 8, 0.2)'; 
    ctx.fillRect(0, 0, width, height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

// GSAP Animations
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    gsap.utils.toArray('.glass-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });
}

resize();
initParticles();
animate();
initGSAP();

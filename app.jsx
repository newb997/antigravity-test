const { useEffect, useRef } = React;

// Particle Engine Logic
class Particle {
    constructor(x, y, baseX, baseY, canvasWidth, canvasHeight) {
        this.baseX = baseX;
        this.baseY = baseY;
        this.x = x;
        this.y = y;
        this.size = 1.5;
        this.color = '#1d1d1f';
        this.density = (Math.random() * 20) + 1;
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.08;
        this.friction = 0.9;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update(mouse, mouseRadius) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let force = (mouseRadius - distance) / mouseRadius;

        if (distance < mouseRadius) {
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

function Navbar() {
    return (
        <nav>
            <div className="container nav-container">
                <a href="#" className="logo">Portfolio</a>
                <div className="nav-links">
                    <a href="#hero">Overview</a>
                    <a href="#about">About</a>
                    <a href="#projects">Work</a>
                    <a href="#contact">Contact</a>
                </div>
            </div>
        </nav>
    );
}

function Hero() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        let particlesArray = [];
        let mouse = { x: -1000, y: -1000 };
        let mouseRadius = 100;
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particlesArray = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let fontSize = Math.min(canvas.width * 0.1, 100);
            ctx.font = `600 ${fontSize}px -apple-system,SF Pro Display,Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Portfolio", canvas.width / 2, canvas.height / 2);

            const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let step = 6;
            for (let y = 0; y < canvas.height; y += step) {
                for (let x = 0; x < canvas.width; x += step) {
                    if (data.data[((y * canvas.width + x) * 4) + 3] > 128) {
                        particlesArray.push(new Particle(x, y, x, y, canvas.width, canvas.height));
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update(mouse, mouseRadius);
                particlesArray[i].draw(ctx);
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section id="hero">
            <canvas id="particle-canvas" ref={canvasRef}></canvas>
            <div className="hero-content">
                <h1 style={{ display: 'none' }}>Portfolio</h1>
                <p className="section-sub" style={{ marginTop: '200px', opacity: 0.6 }}>Design meets innovation.</p>
            </div>
        </section>
    );
}

function About() {
    return (
        <section id="about" className="container">
            <h2 className="reveal">About</h2>
            <p className="section-sub reveal">단순함이 궁극의 정교함입니다.<br />Apple의 철학을 닮은 깔끔하고 직관적인 웹 경험을 지향합니다.</p>

            <div className="tech-stack grid-3">
                <div className="tech-item reveal">
                    <i className="fab fa-react" style={{ color: '#61dafb' }}></i>
                    <h4>React</h4>
                    <p>컴포넌트 기반 아키텍처, 선언적 UI 구현</p>
                </div>
                <div className="tech-item reveal">
                    <i className="fab fa-js-square" style={{ color: '#f7df1e' }}></i>
                    <h4>JavaScript</h4>
                    <p>ES6+, 비동기 프로그래밍, Canvas API 활용 인터랙션 구현</p>
                </div>
                <div className="tech-item reveal">
                    <i className="fab fa-html5" style={{ color: '#e34f26' }}></i>
                    <h4>HTML5 / CSS3</h4>
                    <p>시맨틱 마크업, Flexbox/Grid, 고성능 CSS 애니메이션</p>
                </div>
                <div className="tech-item reveal">
                    <i className="fas fa-bolt" style={{ color: '#0066cc' }}></i>
                    <h4>Vite / GSAP</h4>
                    <p>고성능 빌드 도구 및 고난도 스크롤 애니메이션 최적화</p>
                </div>
                <div className="tech-item reveal">
                    <i className="fab fa-git-alt" style={{ color: '#f05032' }}></i>
                    <h4>Git / GitHub</h4>
                    <p>브랜치 전략 기반의 협업 및 자동화 배포 프로세스 구축</p>
                </div>
                <div className="tech-item reveal">
                    <i className="fas fa-paint-brush" style={{ color: '#ff007f' }}></i>
                    <h4>UI/UX Design</h4>
                    <p>사용자 중심의 미니멀 디자인 및 인터랙티브 경험 설계</p>
                </div>
            </div>
        </section>
    );
}

function Works() {
    return (
        <section id="projects" className="container">
            <h2 className="reveal" style={{ marginBottom: '60px' }}>Selected Works</h2>
            <div className="projects-grid">
                <div className="project-card reveal">
                    <div className="project-image">
                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" alt="Swift UI Project" />
                    </div>
                    <div className="project-info">
                        <h3>Swift UI Kit</h3>
                        <p>애플 디자인 가이드를 준수하는 정밀한 UI 컴포넌트 라이브러리 제작.</p>
                    </div>
                </div>
                <div className="project-card reveal">
                    <div className="project-image">
                        <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" alt="Precision Project" />
                    </div>
                    <div className="project-info">
                        <h3>Precision Engine</h3>
                        <p>고도의 렌더링 기술을 활용한 웹 기반 3D 물리 엔진 인터랙션 연구.</p>
                    </div>
                </div>
                <div className="project-card reveal">
                    <div className="project-image">
                        <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80" alt="Design Lab" />
                    </div>
                    <div className="project-info">
                        <h3>Design Lab</h3>
                        <p>사용자 경험을 극대화하는 미니멀리즘 인터페이스와 애니메이션 시스템 설계.</p>
                    </div>
                </div>
                <div className="project-card reveal">
                    <div className="project-image">
                        <img src="https://images.unsplash.com/photo-1517139274689-d107a0494dfd?auto=format&fit=crop&w=800&q=80" alt="Mobile Experience" />
                    </div>
                    <div className="project-info">
                        <h3>Mobile First</h3>
                        <p>모든 기기에서 완벽한 가독성과 조작감을 제공하는 차세대 웹 레이아웃.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Contact() {
    return (
        <section id="contact" className="container">
            <h2 className="reveal">Connect</h2>
            <p className="section-sub reveal">새로운 가능성을 위한 대화는 언제나 열려있습니다.</p>
            <a href="mailto:hello@apple.style" className="cta-button reveal">Say Hello</a>
        </section>
    );
}

function Footer() {
    return (
        <footer style={{ padding: '100px 0 40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
            <div className="container">
                <p>Copyright © 2026 Developer Portfolio. Built with React. All rights reserved.</p>
            </div>
        </footer>
    );
}

function App() {
    useEffect(() => {
        // Initialize GSAP scroll animations after initial React Render
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Allow DOM to settle before calculating scroll positions
            setTimeout(() => {
                gsap.utils.toArray('.reveal').forEach(el => {
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
            }, 100);
        }
    }, []);

    return (
        <React.Fragment>
            <Navbar />
            <main>
                <Hero />
                <About />
                <Works />
                <Contact />
            </main>
            <Footer />
        </React.Fragment>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

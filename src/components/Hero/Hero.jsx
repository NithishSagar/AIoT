import { useEffect, useRef, useState } from 'react';
import './Hero.css';

const Hero = () => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const floatingIconRefs = useRef([]);
  const [displayText, setDisplayText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const fullText = 'Connecting Intelligence to the World';

  // Store original positions for each icon
  const originalPositions = useRef([]);

  // Typewriter effect with animation sequence
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setTypingComplete(true);
        // After typing completes, show background
        setTimeout(() => {
          setShowBackground(true);
          // Then show content from below
          setTimeout(() => {
            setShowContent(true);
          }, 600);
        }, 300);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // Floating icons mouse interaction
  useEffect(() => {
    const heroSection = heroRef.current;
    const icons = floatingIconRefs.current.filter(Boolean);
    
    if (!heroSection || icons.length === 0) return;

    // Store original center positions of each icon
    const updateOriginalPositions = () => {
      originalPositions.current = icons.map((icon) => {
        const rect = icon.getBoundingClientRect();
        const heroRect = heroSection.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - heroRect.left,
          y: rect.top + rect.height / 2 - heroRect.top
        };
      });
    };

    updateOriginalPositions();
    window.addEventListener('resize', updateOriginalPositions);

    const REPULSION_RADIUS = 150;
    const MAX_REPULSION = 60;
    const MAX_ROTATION = 15;

    const handleMouseMove = (e) => {
      const heroRect = heroSection.getBoundingClientRect();
      const mouseX = e.clientX - heroRect.left;
      const mouseY = e.clientY - heroRect.top;

      icons.forEach((icon, index) => {
        const rect = icon.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2 - heroRect.left;
        const iconCenterY = rect.top + rect.height / 2 - heroRect.top;

        // Calculate distance from mouse to icon center
        const dx = iconCenterX - mouseX;
        const dy = iconCenterY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < REPULSION_RADIUS) {
          // Calculate repulsion strength (closer = stronger)
          const proximityRatio = 1 - (distance / REPULSION_RADIUS);
          const repulsionStrength = proximityRatio * MAX_REPULSION;

          // Calculate repulsion direction (normalized)
          const angle = Math.atan2(dy, dx);
          const offsetX = Math.cos(angle) * repulsionStrength;
          const offsetY = Math.sin(angle) * repulsionStrength;

          // Calculate rotation based on horizontal push direction
          const rotation = (dx > 0 ? 1 : -1) * proximityRatio * MAX_ROTATION;

          // Apply repulsion transform
          icon.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
          icon.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;

          // Intensify glow based on proximity
          const glowIntensity = 0.3 + (proximityRatio * 0.7);
          const glowSize = 10 + (proximityRatio * 30);
          icon.style.boxShadow = `0 0 ${glowSize}px rgba(0, 245, 212, ${glowIntensity})`;
          icon.style.opacity = 0.3 + (proximityRatio * 0.5);

          // Pause float animation
          icon.classList.add('interacting');
        } else {
          // Return to original position with spring effect
          icon.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease-out, opacity 0.6s ease-out';
          icon.style.transform = 'translate(0, 0) rotate(0deg)';
          icon.style.boxShadow = '';
          icon.style.opacity = '';

          // Resume float animation
          icon.classList.remove('interacting');
        }
      });
    };

    const handleMouseLeave = () => {
      // Reset all icons when mouse leaves hero section
      icons.forEach((icon) => {
        icon.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease-out, opacity 0.6s ease-out';
        icon.style.transform = 'translate(0, 0) rotate(0deg)';
        icon.style.boxShadow = '';
        icon.style.opacity = '';
        icon.classList.remove('interacting');
      });
    };

    heroSection.addEventListener('mousemove', handleMouseMove);
    heroSection.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      heroSection.removeEventListener('mousemove', handleMouseMove);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', updateOriginalPositions);
    };
  }, []);

  // Particle network canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 168, 150, 0.6)';
        ctx.fill();
        ctx.shadowColor = '#00A896';
        ctx.shadowBlur = 10;
      }
    }

    const initParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - distance / 150) * 0.3;
            ctx.strokeStyle = `rgba(0, 168, 150, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="hero" id="about" ref={heroRef}>
      <canvas ref={canvasRef} className={`hero-canvas ${showBackground ? 'visible' : ''}`}></canvas>
      
      <div className={`hero-floating-icons ${showBackground ? 'visible' : ''}`}>
        <span 
          className="floating-icon icon-1" 
          ref={(el) => (floatingIconRefs.current[0] = el)}
        >🧠</span>
        <span 
          className="floating-icon icon-2" 
          ref={(el) => (floatingIconRefs.current[1] = el)}
        >📡</span>
        <span 
          className="floating-icon icon-3" 
          ref={(el) => (floatingIconRefs.current[2] = el)}
        >💻</span>
        <span 
          className="floating-icon icon-4" 
          ref={(el) => (floatingIconRefs.current[3] = el)}
        >⚡</span>
      </div>

      <div className="hero-content">
        <h1 className={`hero-title ${typingComplete ? 'glitch' : ''}`} data-text={displayText}>
          {displayText}
          <span className="typing-cursor">|</span>
        </h1>
        <p className={`hero-subtitle ${showContent ? 'visible' : ''}`}>
          Where Artificial Intelligence meets the Internet of Things. 
          Building the bridge between intelligent systems and connected devices 
          to shape tomorrow's world.
        </p>
        <div className={`hero-buttons ${showContent ? 'visible' : ''}`}>
          <a href="#join" className="btn btn-primary">
            Join the Network
          </a>
          <a href="#projects" className="btn btn-ghost">
            Explore Projects
          </a>
        </div>
      </div>

      <div className={`hero-scroll-indicator ${showContent ? 'visible' : ''}`}>
        <span>Scroll to explore</span>
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
};

export default Hero;

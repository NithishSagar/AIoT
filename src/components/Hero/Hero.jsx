import { useEffect, useRef, useState } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import './Hero.css';

const Hero = () => {
  const { content } = useSiteContent();
  const heroData = content.hero || {};
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const floatingIconRefs = useRef([]);
  const [displayText, setDisplayText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const fullText = heroData.headline || 'Make Things Think!';

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
          icon.style.boxShadow = `0 0 ${glowSize}px rgba(79, 70, 229, ${glowIntensity})`;
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
    let orbs = [];
    let time = 0;

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
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 3 + 1.5;
        this.baseOpacity = Math.random() * 0.4 + 0.4;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        const pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.3 + 0.7;
        const opacity = this.baseOpacity * pulse;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 70, 229, ${opacity})`;
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = '#4F46E5';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${opacity * 0.8})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class Orb {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 80 + 40;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.pulseSpeed = Math.random() * 0.01 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
      }

      draw() {
        const pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.5 + 0.5;
        
        // Outer ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * (0.8 + pulse * 0.2), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(79, 70, 229, ${0.1 + pulse * 0.1})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Inner gradient
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        gradient.addColorStop(0, `rgba(99, 102, 241, ${0.15 * pulse})`);
        gradient.addColorStop(0.5, `rgba(79, 70, 229, ${0.05 * pulse})`);
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    const drawGrid = () => {
      const gridSize = 60;
      const gridOpacity = 0.04 + Math.sin(time * 0.005) * 0.02;
      
      ctx.strokeStyle = `rgba(79, 70, 229, ${gridOpacity})`;
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawHexagons = () => {
      const hexRadius = 30;
      const spacing = 100;
      const hexOpacity = 0.06 + Math.sin(time * 0.008) * 0.03;
      
      ctx.strokeStyle = `rgba(79, 70, 229, ${hexOpacity})`;
      ctx.lineWidth = 1;
      
      for (let x = -hexRadius; x < canvas.width + hexRadius; x += spacing * 1.5) {
        for (let y = -hexRadius; y < canvas.height + hexRadius; y += spacing * 0.866) {
          const offsetX = (Math.floor(y / (spacing * 0.866)) % 2) * (spacing * 0.75);
          drawHexagon(x + offsetX, y, hexRadius);
        }
      }
    };
    
    const drawHexagon = (cx, cy, r) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    };

    const initParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 8000);
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
      
      // Create floating orbs
      const orbCount = 5;
      orbs = [];
      for (let i = 0; i < orbCount; i++) {
        orbs.push(new Orb());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - distance / 180) * 0.5;
            ctx.strokeStyle = `rgba(79, 70, 229, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background elements
      drawHexagons();
      
      // Draw orbs behind particles
      orbs.forEach((orb) => {
        orb.update();
        orb.draw();
      });

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
        {(heroData.floatingIcons || []).filter(icon => icon.enabled !== false).map((icon, index) => (
          <span 
            key={icon.id}
            className={`floating-icon icon-${index + 1}`} 
            ref={(el) => (floatingIconRefs.current[index] = el)}
          >{icon.icon}</span>
        ))}
      </div>

      <div className="hero-content">
        <h1 className={`hero-title ${typingComplete ? 'glitch' : ''}`} data-text={displayText}>
          {displayText}
          <span className="typing-cursor">|</span>
        </h1>
        <p className={`hero-subtitle ${showContent ? 'visible' : ''}`}>
          {heroData.subheadline || 'Where Artificial Intelligence meets the Internet of Things. Building the bridge between intelligent systems and connected devices to shape tomorrow\'s world.'}
        </p>
        <div className={`hero-buttons ${showContent ? 'visible' : ''}`}>
          {(heroData.buttons || []).map((button) => (
            <a 
              key={button.id} 
              href={button.href} 
              className={`btn btn-${button.style || 'primary'}`}
            >
              {button.label}
            </a>
          ))}
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

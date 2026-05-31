/* 
=============================================================================
INTERACTIVE GOLD PARTICLES CANVAS & SCROLL REVEAL (NOMINA APP LANDING)
=============================================================================
*/

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initScrollReveal();
  initTiltCards();
});

/**
 * Interactive Gold Particles Floating Background
 */
function initParticles() {
  const canvas = document.getElementById("gold-particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particlesArray = [];
  const numberOfParticles = 75; // Balanced performance & aesthetics
  
  const mouse = {
    x: null,
    y: null,
    radius: 120 // Interaction distance
  };

  // Track mouse coordinates
  window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  // Clear mouse tracking on leave
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle resize
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Particle Blueprint
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1; // 1px to 4px gold flakes
      this.speedX = Math.random() * 0.3 - 0.15; // Slow drift
      this.speedY = -(Math.random() * 0.5 + 0.1); // Slow upward float
      this.density = Math.random() * 15 + 1;
      
      // Luxurious golden colors HSL variations
      const goldHue = Math.random() * 15 + 35; // 35 to 50 (gold hue spectrum)
      const goldLightness = Math.random() * 20 + 45; // Metallic reflections
      this.color = `hsla(${goldHue}, 80%, ${goldLightness}%, ${Math.random() * 0.5 + 0.3})`;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      // Add subtle glow to larger particles
      if (this.size > 2.5) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(212, 175, 55, 0.4)";
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    }

    update() {
      // Float upward & drift
      this.y += this.speedY;
      this.x += this.speedX;

      // Wrap around screen boundaries
      if (this.y < 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }
      if (this.x < 0 || this.x > canvas.width) {
        this.x = Math.random() * canvas.width;
      }

      // Mouse Interaction (tactile golden dust repulsion)
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          
          // Speed response based on closeness
          let maxForce = (mouse.radius - distance) / mouse.radius;
          let force = maxForce * 0.8;
          
          this.x -= forceDirectionX * force * this.density * 0.3;
          this.y -= forceDirectionY * force * this.density * 0.3;
        }
      }
    }
  }

  // Populate particles
  function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  // Loop & Render
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    
    requestAnimationFrame(animate);
  }

  init();
  animate();
}

/**
 * Scroll Reveal Animations using IntersectionObserver
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // We can stop observing once it is shown
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15, // Reveal when 15% is visible
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });
}

/**
 * Tridimensional Tilt Effect on Download Cards
 */
function initTiltCards() {
  const cards = document.querySelectorAll(".download-card, .credit-item");
  
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position inside element
      const y = e.clientY - rect.top;  // y position inside element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation angles (max 6 degrees tilt for premium feel)
      const rotateX = ((centerY - y) / centerY) * 6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    // Reset position on leave
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
    });
  });
}

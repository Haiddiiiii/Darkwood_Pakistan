/* ===== DARKWOOD PAKISTAN — JavaScript ===== */
'use strict';

// ─── LOADER ───────────────────────────────────────────────────────────────────
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.cursor = 'none';
    initParticles();
    countUpStats();
  }, 2200);
});

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effects
document.querySelectorAll('a, button, .service-card, .portfolio-item, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursorFollower.style.width = '56px';
    cursorFollower.style.height = '56px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursorFollower.style.width = '36px';
    cursorFollower.style.height = '36px';
  });
});

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav link on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    const secTop = sec.offsetTop - 120;
    if (window.scrollY >= secTop) current = sec.getAttribute('id');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === current) link.classList.add('active');
  });
}

// ─── SMOOTH SCROLL ────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.offsetTop - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ─── PARTICLE SYSTEM ──────────────────────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const count = Math.floor(window.innerWidth / 30);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.life = Math.random() * 200 + 100;
      this.maxLife = this.life;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life--;
      this.alpha = (this.life / this.maxLife) * 0.4;
      if (this.life <= 0 || this.y < -10) {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.life = this.maxLife;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < count; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ─── COUNT UP STATS ──────────────────────────────────────────────────────────
function countUpStats() {
  const stats = document.querySelectorAll('.stat-num');
  stats.forEach(stat => {
    const target = parseInt(stat.dataset.target);
    let count = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }
      stat.textContent = Math.floor(count);
    }, 16);
  });
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── PORTFOLIO FILTER ─────────────────────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioItems.forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'fadeIn 0.4s ease both';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ─── TESTIMONIALS SLIDER ──────────────────────────────────────────────────────
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.test-dot');
let currentTestimonial = 0;
let testimonialTimer;

function showTestimonial(idx) {
  testimonialCards.forEach(c => c.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  testimonialCards[idx].classList.add('active');
  dots[idx].classList.add('active');
  currentTestimonial = idx;
}

function nextTestimonial() {
  showTestimonial((currentTestimonial + 1) % testimonialCards.length);
}

function prevTestimonial() {
  showTestimonial((currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length);
}

document.getElementById('test-next').addEventListener('click', () => {
  nextTestimonial();
  resetTimer();
});

document.getElementById('test-prev').addEventListener('click', () => {
  prevTestimonial();
  resetTimer();
});

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    showTestimonial(i);
    resetTimer();
  });
});

function resetTimer() {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(nextTestimonial, 5000);
}

testimonialTimer = setInterval(nextTestimonial, 5000);

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();

  if (!name || !phone) {
    alert('Please fill in your name and phone number.');
    return;
  }

  const submitBtn = document.getElementById('form-submit');
  submitBtn.disabled = true;
  submitBtn.querySelector('span').textContent = 'Sending...';

  // Simulate submission (in production, replace with actual API call)
  setTimeout(() => {
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.querySelector('span').textContent = 'Send Message';
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);

    // Build WhatsApp message
    const service = document.getElementById('fservice').value;
    const message = document.getElementById('fmessage').value;
    const waText = encodeURIComponent(
      `Hello Darkwood Pakistan!\n\nName: ${name}\nPhone: ${phone}\nService: ${service || 'General Inquiry'}\n\n${message ? 'Message: ' + message : ''}`
    );
    window.open(`https://wa.me/923165536627?text=${waText}`, '_blank');
  }, 1000);
});

// ─── NAVBAR TRANSPARENT ON HERO ───────────────────────────────────────────────
// Ensure initially transparent
if (window.scrollY <= 60) navbar.classList.remove('scrolled');

// ─── PARALLAX HERO ────────────────────────────────────────────────────────────
const heroImgFallback = document.querySelector('.hero-img-fallback');
window.addEventListener('scroll', () => {
  if (heroImgFallback) {
    const scrollY = window.scrollY;
    heroImgFallback.style.transform = `scale(1.08) translateY(${scrollY * 0.15}px)`;
  }
});

// ─── ABOUT IMAGE SECONDARY PARALLAX ──────────────────────────────────────────
const aboutSection = document.getElementById('about');
const imgSecondary = document.querySelector('.about-img-secondary');

if (aboutSection && imgSecondary) {
  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        imgSecondary.style.transition = 'all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
        imgSecondary.style.opacity = '1';
        imgSecondary.style.transform = 'none';
      }
    });
  }, { threshold: 0.3 });
  imgObserver.observe(aboutSection);
}

// ─── ANIMATE TITLE ON LOAD (fallback) ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.title-line').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    setTimeout(() => {
      el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 800 + i * 150);
  });
});

// ─── WHATSAPP FLOAT PULSE ─────────────────────────────────────────────────────
const waFloat = document.getElementById('whatsapp-float');
if (waFloat) {
  setInterval(() => {
    waFloat.style.transform = 'scale(1.08)';
    setTimeout(() => { waFloat.style.transform = 'scale(1)'; }, 300);
  }, 4000);
}

// ─── SERVICE CARD TILT EFFECT ─────────────────────────────────────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
  });
});

// ─── FOOTER LINKS SCROLL ──────────────────────────────────────────────────────
document.querySelectorAll('.footer a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

console.log('%cDarkwood Pakistan', 'color: #c9a84c; font-size: 24px; font-weight: bold; font-family: serif;');
console.log('%cPremium Interior Design & Furniture Manufacturing since 2010', 'color: #6b3a1f; font-size: 12px;');
console.log('%cOwner: Sardar Saqib | Contact: 03165536627', 'color: #8c7055; font-size: 11px;');

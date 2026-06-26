
// Loader
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('loader-fade-out');
  }, 1200);
  setTimeout(() => {
    loader.style.display = 'none';
    document.body.classList.add('loaded');
  }, 1800);
});
 
// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorLabel = document.getElementById('cursor-label');
let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0;
 
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
 
if (!isTouchDevice) {
  const trails = [];
  for (let i = 0; i < 5; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.opacity = (0.3 - i * 0.05).toString();
    document.body.appendChild(trail);
    trails.push({ el: trail, x: 0, y: 0 });
  }
 
  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });
 
  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
 
  function animateCursor() {
    cursorX += (targetX - cursorX) * 0.15;
    cursorY += (targetY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursorLabel.style.left = cursorX + 'px';
    cursorLabel.style.top = cursorY + 'px';
 
    trails.forEach((trail, i) => {
      const delay = (i + 1) * 0.08;
      trail.x += (targetX - trail.x) * delay;
      trail.y += (targetY - trail.y) * delay;
      trail.el.style.left = trail.x + 'px';
      trail.el.style.top = trail.y + 'px';
    });
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
 
  document.querySelectorAll('.project-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      cursor.classList.add('expanded');
      cursorLabel.classList.add('visible');
    });
    row.addEventListener('mouseleave', () => {
      cursor.classList.remove('expanded');
      cursorLabel.classList.remove('visible');
    });
  });
}
 
// Clock
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}
updateClock();
setInterval(updateClock, 1000);
 
// Navbar scroll
let lastScrollY = 0;
let ticking = false;
const navbar = document.getElementById('navbar');
 
window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;
  if (!ticking) {
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', lastScrollY > 100);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
 
// Particles
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [], mouseX = 0, mouseY = 0;
 
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
 
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.3 + 0.2;
    this.pulse = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += 0.03;
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 120) {
      const force = (120 - distance) / 120;
      this.x -= dx * force * 0.018;
      this.y -= dy * force * 0.018;
    }
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }
  draw() {
    const pulseOpacity = this.opacity + Math.sin(this.pulse) * 0.15;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 57, 70, ${Math.max(0.1, pulseOpacity)})`;
    ctx.fill();
  }
}
 
function initParticles() {
  particles = [];
  const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
 
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 120) {
        const opacity = (1 - distance / 120) * 0.25;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(230, 57, 70, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
    const dx = mouseX - particles[i].x;
    const dy = mouseY - particles[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 120) {
      const opacity = (1 - distance / 120) * 0.35;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(230, 57, 70, ${opacity})`;
      ctx.lineWidth = 0.8;
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    }
  }
}
 
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
 
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });
 
resizeCanvas();
initParticles();
animateParticles();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
 
// Experience Cards
const cards = document.querySelectorAll('.experience-card');
const dots = document.querySelectorAll('.card-dot');
let currentCard = 0;
const cardInterval = 4000;
 
function showCard(index) {
  cards.forEach((card, i) => {
    card.classList.remove('active', 'exiting');
    if (i === currentCard && i !== index) {
      card.classList.add('exiting');
    }
  });
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  setTimeout(() => {
    cards[index].classList.add('active');
  }, 100);
  currentCard = index;
}
 
function nextCard() {
  const next = (currentCard + 1) % cards.length;
  showCard(next);
}
 
let cardTimer = setInterval(nextCard, cardInterval);
 
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    clearInterval(cardTimer);
    showCard(index);
    cardTimer = setInterval(nextCard, cardInterval);
  });
});
 
// Project Detail Panel
const projectDetail = document.getElementById('project-detail');
const detailClose = document.getElementById('detail-close');
const detailTitle = document.getElementById('detail-title');
const detailDesc = document.getElementById('detail-desc');
const detailCode = document.getElementById('detail-code');
const detailCategory = document.getElementById('detail-category');
 
const projectsData = {
  '73software': {
    title: '73SOFTWARE.DEV',
    category: 'Branding · UX/UI · Desarrollo Web',
    desc: 'El proyecto 73software.dev se desarrollo en colaboracion con un companiero, con el objetivo de crear una marca tecnologica orientada al desarrollo de software y soluciones digitales. Este trabajo permitio integrar procesos de disenio estrategico con dinamicas de trabajo en equipo, abordando tanto la construccion de identidad como el desarrollo de un producto digital.\n\nEn una primera fase, se llevo a cabo la conceptualizacion de la marca, definiendo su propuesta de valor, publico objetivo y enfoque comunicativo. A partir de esto, se desarrollo la identidad visual, incluyendo el disenio del logotipo, la seleccion cromatica y la definicion de lineamientos graficos, buscando proyectar una imagen moderna, tecnologica y coherente con el sector del desarrollo de software.\n\nPosteriormente, se avanzo hacia la estructuracion del producto digital, iniciando con la creacion de wireframes que permitieron definir la arquitectura de la informacion y la jerarquia de contenidos del sitio web. Se plantearon las principales secciones, enfocadas en la presentacion de servicios, portafolio y contacto, priorizando la claridad en la comunicacion y la generacion de confianza en el usuario.\n\nDe manera paralela, se inicio el disenio de interfaces, aplicando principios de experiencia de usuario (UX/UI) para construir una navegacion intuitiva y una estructura visual coherente con la identidad de la marca. Este proceso se desarrollo de forma iterativa, permitiendo ajustar decisiones de disenio a medida que avanza el proyecto.\n\nActualmente, 73software.dev se encuentra en fase de desarrollo, con avances significativos en la definicion de su estructura, disenio visual y experiencia de usuario.',
    code: 'JLSM-0001',
    highlights: ['Brand Identity', 'Wireframing', 'UI/UX Design'],
    stats: { weeks: '4', screens: '5', satisfaction: '100%' },
    images: [
      'images/detalle-proyectos/73/imagen-1.jpg',
      'images/detalle-proyectos/73/imagen-2.jpg',
      'images/detalle-proyectos/73/imagen-3.jpg'
    ]
  },
  'sube-nube': {
    title: 'SUBE A LA NUBE',
    category: 'Branding · UX/UI · Desarrollo Web',
    desc: 'SubealaNube fue un proyecto desarrollado desde su etapa conceptual, enfocado en la creacion de un servicio digital orientado a la gestion de dominios y correos corporativos para empresas. Su propuesta de valor se centra en simplificar un proceso que usualmente resulta tecnico y complejo, permitiendo a los usuarios adquirir dominios y administrar sus correos empresariales de manera facil, clara y accesible.\n\nEl proceso inicio con una fase de investigacion, analizando plataformas similares del sector para identificar problematicas comunes en la experiencia de usuario, especialmente en procesos de compra, configuracion y gestion de servicios digitales.\n\nSe llevo a cabo el redisenio de la identidad visual, replanteando el logotipo y desarrollando un personaje llamado Nimbu, concebido como guia y mascota del sistema, con el objetivo de acompanar al usuario durante su experiencia y facilitar la comprension de los procesos.\n\nEn la fase de disenio UX/UI, se desarrollaron wireframes en Figma, definiendo arquitectura, flujos de usuario y procesos clave como la compra y gestion del servicio. Posteriormente se realizaron prototipos para validar la experiencia.\n\nFinalmente, el proyecto fue llevado a desarrollo mediante HTML, CSS y JavaScript, utilizando Tailwind CSS, logrando un producto funcional y coherente entre disenio e implementacion.',
    code: 'JLSM-0002',
    highlights: ['UX Research', 'Brand Identity', 'Figma Prototyping'],
    stats: { weeks: '8', screens: '10', satisfaction: '100%' },
    images: [
      'images/detalle-proyectos/SUBE/imagen-1.jpg',
      'images/detalle-proyectos/SUBE/imagen-2.jpg',
      'images/detalle-proyectos/SUBE/imagen-3.jpg'
    ]
  },
  'trebol': {
    title: 'TREBOL COLOMBIA S.A.S.',
    category: 'UX Research · Arquitectura Info · Figma',
    desc: 'Rediseño completo de la experiencia digital para una de las principales empresas de servicios financieros de Colombia. El objetivo era modernizar la plataforma existente y mejorar significativamente la experiencia del usuario.\n\nEl proceso comenzo con una investigacion exhaustiva que incluyo analisis heuristico, pruebas de usabilidad con usuarios reales, y mapeo de journey maps. Estos insights revelaron puntos de friccion criticos que guiaron las decisiones de diseño posteriores.',
    code: 'JLSM-0003',
    highlights: ['UX Research', 'Information Architecture', 'Design System'],
    stats: { weeks: '24', screens: '60+', satisfaction: '95%' },
    images: [
      'images/detalle-proyectos/TREBOL/imagen-1.jpg',
      'images/detalle-proyectos/TREBOL/imagen-2.jpg',
      'images/detalle-proyectos/TREBOL/imagen-3.jpg'
    ]
  },
  'pedidos-click': {
    title: 'PEDIDOS.CLICK',
    category: 'Branding · Identidad Visual · Manual de Marca',
    desc: 'Desarrollo de identidad de marca completa para plataforma de pedidos online. Desde el naming hasta el manual de marca, cada elemento fue cuidadosamente diseñado para crear una presencia memorable en el mercado.\n\nEl proceso de branding comenzo con la definicion de la estrategia de marca, incluyendo analisis de competencia, definicion de valores y personalidad de marca.',
    code: 'JLSM-0004',
    highlights: ['Brand Identity', 'Logo Design', 'Brand Guidelines'],
    stats: { weeks: '10', screens: '15+', satisfaction: '100%' },
    images: [
      'images/detalle-proyectos/PEDIDOS/imagen-1.jpg',
      'images/detalle-proyectos/PEDIDOS/imagen-2.jpg',
      'images/detalle-proyectos/PEDIDOS/imagen-3.jpg'
    ]
  },
  'santoto-pro': {
    title: 'SANTOTO+PRO',
    category: 'App Design · Branding · Design System · Motion',
    desc: 'Diseño completo de la aplicacion movil SantotoPro para la Universidad Santo Tomas, junto con la creacion de imagen de marca y recursos visuales. Este proyecto represento un hito importante en mi carrera como diseñador de interaccion.\n\nLa aplicacion fue concebida como una herramienta integral para estudiantes y profesionales, ofreciendo acceso a cursos, recursos educativos, networking y oportunidades laborales.',
    code: 'JLSM-0005',
    highlights: ['Mobile App Design', 'Motion Graphics', 'Design System'],
    stats: { weeks: '18', screens: '80+', satisfaction: '97%' },
    images: [
      'images/detalle-proyectos/SANTOTO/imagen-1.jpg',
      'images/detalle-proyectos/SANTOTO/imagen-2.jpg',
      'images/detalle-proyectos/SANTOTO/imagen-3.jpg'
    ]
  }
};
 
// ← BLOQUE CORREGIDO: ahora actualiza las imágenes al hacer click
document.querySelectorAll('.project-row').forEach(row => {
  row.addEventListener('click', () => {
    const project = projectsData[row.dataset.project];
    if (project) {
      detailTitle.textContent = project.title;
      detailDesc.textContent = project.desc;
      detailCode.textContent = project.code;
      detailCategory.textContent = project.category;
 
      const detailImgs = document.querySelectorAll('.detail-img');
      project.images.forEach((src, i) => {
        if (detailImgs[i]) detailImgs[i].src = src;
      });
 
      const highlightItems = document.querySelectorAll('.highlight-text');
      project.highlights.forEach((highlight, i) => {
        if (highlightItems[i]) highlightItems[i].textContent = highlight;
      });
      document.getElementById('stat-1').textContent = project.stats.weeks;
      document.getElementById('stat-2').textContent = project.stats.screens;
      document.getElementById('stat-3').textContent = project.stats.satisfaction;
      projectDetail.classList.add('active');
      document.body.style.overflow = 'hidden';
      animateStats();
    }
  });
});
 
detailClose.addEventListener('click', () => {
  projectDetail.classList.remove('active');
  document.body.style.overflow = '';
});
 
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectDetail.classList.contains('active')) {
    projectDetail.classList.remove('active');
    document.body.style.overflow = '';
  }
});
 
function animateStats() {
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach(stat => {
    const finalValue = stat.textContent;
    const isPercentage = finalValue.includes('%');
    const isPlus = finalValue.includes('+');
    const numericValue = parseInt(finalValue);
    let current = 0;
    const increment = numericValue / 20;
    const suffix = isPercentage ? '%' : (isPlus ? '+' : '');
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        current = numericValue;
        clearInterval(timer);
      }
      stat.textContent = Math.floor(current) + suffix;
    }, 40);
  });
}
 
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
 
// Intersection Observer for reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
 
document.querySelectorAll('.work-header, .project-row, .about-name, .about-text, .about-stack-title, .cert-header, .footer-top, .footer-tagline, .footer-links, .footer-bottom').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});
 
document.querySelectorAll('.project-row').forEach((row, i) => {
  row.style.transitionDelay = `${i * 0.08}s`;
});
 
// Parallax for glow orbs
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  document.querySelectorAll('.glow-orb').forEach((el, i) => {
    el.style.transform = `translateY(${scrolled * (0.1 + i * 0.05)}px)`;
  });
}, { passive: true });
 
// Magnetic buttons
if (!isTouchDevice) {
  document.querySelectorAll('.nav-contact, .hero-work-link, .footer-link').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - rect.left - rect.width/2) * 0.2}px, ${(e.clientY - rect.top - rect.height/2) * 0.2}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}
 
// ==========================================
// DRAGGABLE CAROUSEL FACTORY
// ==========================================
function createDraggableCarousel(containerId, trackId, options = {}) {
  const container = document.getElementById(containerId);
  const track = document.getElementById(trackId);
  if (!container || !track) return null;
 
  const config = {
    autoScroll: true,
    autoScrollSpeed: 0.3,
    duplicateForLoop: true,
    ...options
  };
 
  if (config.duplicateForLoop) {
    const originalItems = track.innerHTML;
    track.innerHTML = originalItems + originalItems + originalItems;
  }
 
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;
  let momentumRafId = null;
  let autoScrollId = null;
  let isDestroyed = false;
 
  function getSetWidth() {
    const items = track.children;
    const setCount = config.duplicateForLoop ? items.length / 3 : items.length;
    const item = items[0];
    if (!item) return 300;
    const gap = 50;
    return setCount * (item.offsetWidth + gap);
  }
 
  function centerCarousel() {
    if (!config.duplicateForLoop) return;
    const setWidth = getSetWidth();
    currentTranslate = -setWidth;
    prevTranslate = currentTranslate;
    setTranslate(currentTranslate);
  }
 
  function setTranslate(val) {
    track.style.transform = `translate3d(${val}px, 0, 0)`;
  }
 
  function checkLoop() {
    if (!config.duplicateForLoop) return;
    const setWidth = getSetWidth();
    if (currentTranslate > -setWidth * 0.3) {
      currentTranslate -= setWidth;
      prevTranslate = currentTranslate;
      track.style.transition = 'none';
      setTranslate(currentTranslate);
    } else if (currentTranslate < -setWidth * 2.7) {
      currentTranslate += setWidth;
      prevTranslate = currentTranslate;
      track.style.transition = 'none';
      setTranslate(currentTranslate);
    }
  }
 
  function stopAllAnimations() {
    if (momentumRafId) { cancelAnimationFrame(momentumRafId); momentumRafId = null; }
    if (autoScrollId) { cancelAnimationFrame(autoScrollId); autoScrollId = null; }
  }
 
  function startDrag(x) {
    stopAllAnimations();
    isDragging = true;
    startX = x;
    prevTranslate = currentTranslate;
    lastX = x;
    lastTime = Date.now();
    velocity = 0;
    track.classList.add('is-dragging');
    track.classList.remove('has-momentum');
    container.style.cursor = 'grabbing';
  }
 
  function moveDrag(x) {
    if (!isDragging) return;
    const now = Date.now();
    const dt = now - lastTime;
    const dx = x - lastX;
    if (dt > 0) velocity = dx / dt * 16;
    currentTranslate = prevTranslate + (x - startX);
    setTranslate(currentTranslate);
    lastX = x;
    lastTime = now;
  }
 
  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('is-dragging');
    container.style.cursor = 'grab';
    if (Math.abs(velocity) > 0.5) {
      track.classList.add('has-momentum');
      applyMomentum();
    } else {
      velocity = 0;
      track.classList.remove('has-momentum');
      checkLoop();
      restartAutoScroll();
    }
  }
 
  function restartAutoScroll() {
    if (isDestroyed || !config.autoScroll) return;
    stopAllAnimations();
    autoScrollId = requestAnimationFrame(autoScroll);
  }
 
  function applyMomentum() {
    const friction = 0.95;
    const minVelocity = 0.1;
    function step() {
      if (isDestroyed || isDragging) { momentumRafId = null; return; }
      velocity *= friction;
      currentTranslate += velocity;
      setTranslate(currentTranslate);
      checkLoop();
      if (Math.abs(velocity) > minVelocity) {
        momentumRafId = requestAnimationFrame(step);
      } else {
        track.classList.remove('has-momentum');
        momentumRafId = null;
        restartAutoScroll();
      }
    }
    momentumRafId = requestAnimationFrame(step);
  }
 
  function autoScroll() {
    if (isDestroyed) return;
    if (!isDragging && !momentumRafId) {
      currentTranslate -= config.autoScrollSpeed;
      setTranslate(currentTranslate);
      checkLoop();
    }
    autoScrollId = requestAnimationFrame(autoScroll);
  }
 
  container.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag(e.pageX); }, { passive: false });
  window.addEventListener('mousemove', (e) => { moveDrag(e.pageX); }, { passive: true });
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('mouseleave', endDrag);
 
  container.addEventListener('touchstart', (e) => { startDrag(e.touches[0].pageX); }, { passive: true });
  container.addEventListener('touchmove', (e) => { moveDrag(e.touches[0].pageX); }, { passive: true });
  container.addEventListener('touchend', endDrag);
 
  container.addEventListener('mouseenter', () => { stopAllAnimations(); });
  container.addEventListener('mouseleave', () => {
    if (!isDragging && !momentumRafId && config.autoScroll) restartAutoScroll();
  });
 
  function init() {
    setTimeout(() => {
      centerCarousel();
      restartAutoScroll();
    }, 500);
  }
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
 
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      centerCarousel();
      restartAutoScroll();
    }, 250);
  });
 
  return { centerCarousel, restartAutoScroll, stopAllAnimations };
}
 
// Initialize tech carousel immediately
const techCarousel = createDraggableCarousel('tech-carousel', 'tech-carousel-track', {
  autoScroll: true,
  autoScrollSpeed: 0.3,
  duplicateForLoop: true
});
 
// Cert carousel - initialized lazily when CTA is opened
let certCarousel = null;
let certCarouselInitialized = false;
 
function initCertCarousel() {
  if (certCarouselInitialized) return;
  certCarouselInitialized = true;
 
  const track = document.getElementById('cert-carousel-track');
  if (!track) return;
 
  function tryInit() {
    const firstCard = track.querySelector('.cert-card');
    if (firstCard && firstCard.offsetWidth > 0) {
      certCarousel = createDraggableCarousel('cert-carousel', 'cert-carousel-track', {
        autoScroll: true,
        autoScrollSpeed: 0.2,
        duplicateForLoop: true
      });
    } else {
      setTimeout(tryInit, 100);
    }
  }
 
  setTimeout(tryInit, 100);
}
 
// Certificates CTA Toggle
const certCtaBtn = document.getElementById('cert-cta-btn');
const certContent = document.getElementById('cert-content');
 
if (certCtaBtn && certContent) {
  certCtaBtn.addEventListener('click', () => {
    const isOpen = certContent.classList.contains('open');
    if (isOpen) {
      certContent.classList.remove('open');
      certCtaBtn.classList.remove('active');
      certCtaBtn.querySelector('.cert-cta-text').textContent = 'Ver Certificados';
      if (certCarousel && certCarousel.stopAllAnimations) certCarousel.stopAllAnimations();
    } else {
      certContent.classList.add('open');
      certCtaBtn.classList.add('active');
      certCtaBtn.querySelector('.cert-cta-text').textContent = 'Ocultar Certificados';
      initCertCarousel();
      setTimeout(() => {
        if (certCarousel && certCarousel.restartAutoScroll) certCarousel.restartAutoScroll();
      }, 700);
      setTimeout(() => {
        document.getElementById('certificates').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  });
}
 
// Text scramble effect
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/';
  }
  setText(newText) {
    const length = newText.length;
    let iterations = 0;
    const interval = setInterval(() => {
      this.el.innerText = newText
        .split('')
        .map((char, i) => {
          if (i < iterations) return newText[i];
          return this.chars[Math.floor(Math.random() * this.chars.length)];
        })
        .join('');
      iterations += 1/2;
      if (iterations >= length) {
        clearInterval(interval);
        this.el.innerText = newText;
      }
    }, 30);
  }
}
 
document.querySelectorAll('.project-row').forEach(row => {
  const nameEl = row.querySelector('.proj-name');
  const originalText = nameEl.textContent;
  const scrambler = new TextScramble(nameEl);
  row.addEventListener('mouseenter', () => { scrambler.setText(originalText); });
});
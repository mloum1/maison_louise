const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle?.addEventListener('click', () => navMenu.classList.toggle('active'));

const heroVideo = document.getElementById('heroVideo');

if (heroVideo) {
  heroVideo.muted = true;
  // TODO : demander au client ce qu'il pense du son ?
  heroVideo.volume = 0.3;
  heroVideo.loop = true;
  heroVideo.play();
  window.addEventListener('click', () => {
    heroVideo.muted = false;
    heroVideo.volume = 0.5;
    heroVideo.play();
  }, { once: true });
}

// Scroll navbar
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
});

// Stats counter avec animation
const animateCounter = (el) => {
  const target = +el.dataset.count || +el.textContent;
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = Math.ceil(target);
      clearInterval(timer);
    } else {
      el.textContent = Math.ceil(current);
    }
  }, 16);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.stat-number[data-count]');
      numbers.forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => statsObserver.observe(el));

// Contact Form avec validation
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const btnText = btn.innerHTML;

  // Validation supplémentaire
  if (!validateForm(form)) {
    showNotification('❌ Veuillez remplir tous les champs correctement', 'error');
    return;
  }

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
  btn.disabled = true;

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    event: form.event.value,
    guests: parseInt(form.guests.value),
    date: form.date.value,
    message: form.message.value.trim()
  };

  try {
    // REMPLACER PAR VOTRE API
    const response = await fetch('https://api.maisonlouise.sn/api/contact', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      showNotification('✅ Message envoyé ! Nous vous répondrons rapidement.', 'success');
      form.reset();
    } else {
      throw new Error('Erreur serveur');
    }
  } catch (error) {
    console.error('Erreur:', error);
    // Simulation pour développement
    await new Promise(resolve => setTimeout(resolve, 1500));
    showNotification('✅ Message reçu ! (Mode démo)', 'success');
    form.reset();
  }

  btn.innerHTML = btnText;
  btn.disabled = false;
});

// Validation formulaire
function validateForm(form) {
  const email = form.email.value;
  const phone = form.phone.value;
  const guests = form.guests.value;
  const message = form.message.value;

  // Email valide
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  // Téléphone valide (format simple)
  if (phone.length < 8) return false;

  // Nombre invités > 0
  if (guests < 1) return false;

  // Message min 20 caractères
  if (message.length < 20) return false;

  return true;
}

// Notification system amélioré
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  const bgColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3';

  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: ${bgColor};
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Smooth scroll amélioré
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 100;
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({top: targetPosition, behavior: 'smooth'});
        navMenu?.classList.remove('active');
      }
    }
  });
});

// Active nav link avec transition
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
});

// Animations au scroll (bonus)
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Ajouter animation aux éléments
document.querySelectorAll('.service-card, .plateau-card, .instagram-post, .contact-card').forEach(el => {
  observer.observe(el);
});

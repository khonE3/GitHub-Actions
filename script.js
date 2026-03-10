// ========================================
// GitHub Actions Summary — Script
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCopyButtons();
  initTabs();
  initBackToTop();
  initParticles();
});

// ---------- Navbar Scroll Effect ----------
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-sidebar a');
  const sections = document.querySelectorAll('.section[id]');

  window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ---------- Mobile Menu ----------
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.mobile-sidebar');
  const overlay = document.querySelector('.overlay');
  const sidebarClose = document.querySelector('.sidebar-close');
  const sidebarLinks = document.querySelectorAll('.mobile-sidebar a');

  function openMenu() {
    hamburger.classList.add('active');
    sidebar.classList.add('open');
    overlay.classList.add('visible');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!sidebar.classList.contains('open')) {
        overlay.style.display = 'none';
      }
    }, 400);
  }

  hamburger.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close button (✕) in sidebar
  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeMenu);
  }

  overlay.addEventListener('click', closeMenu);

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeMenu();
    }
  });
}

// ---------- Scroll Reveal ----------
function initScrollReveal() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  sections.forEach(section => observer.observe(section));
}

// ---------- Copy Code Buttons ----------
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.code-block');
      const code = codeBlock.querySelector('code').textContent;

      navigator.clipboard.writeText(code).then(() => {
        btn.classList.add('copied');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied';

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalText;
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        btn.classList.add('copied');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied';

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalText;
        }, 2000);
      });
    });
  });
}

// ---------- Tabs ----------
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    const parentSection = tabGroup.closest('.section') || tabGroup.parentElement;
    const contents = parentSection.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        buttons.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetContent = parentSection.querySelector(`#${target}`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  });
}

// ---------- Back to Top ----------
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- Particles ----------
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  const colors = ['var(--accent-primary)', 'var(--accent-purple)', 'var(--accent-pink)', 'var(--accent-secondary)'];

  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty('--duration', `${8 + Math.random() * 12}s`);
    particle.style.setProperty('--delay', `${Math.random() * 10}s`);
    particle.style.width = `${2 + Math.random() * 4}px`;
    particle.style.height = particle.style.width;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(particle);
  }
}

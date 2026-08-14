// Initialize Lenis Smooth Scrolling
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: !isTouchDevice,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate GSAP with Lenis
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// Custom Cursor (Desktop / Mouse only)
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (!isTouchDevice && cursorDot && cursorOutline) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = window.innerWidth / 2;
  let outlineY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    gsap.set(cursorDot, {
      x: mouseX,
      y: mouseY
    });
  });

  gsap.ticker.add(() => {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    
    gsap.set(cursorOutline, {
      x: outlineX,
      y: outlineY
    });
  });

  const interactables = document.querySelectorAll('a, button, .look-card, #video-container, input, textarea');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('hover-active');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hover-active');
    });
  });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const hamburgerLines = document.querySelectorAll('.hamburger-line');

let isMenuOpen = false;

function toggleMobileMenu(open) {
  isMenuOpen = (typeof open === 'boolean') ? open : !isMenuOpen;
  
  if (isMenuOpen) {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    lenis.stop();
    
    // Transform hamburger to X
    if (hamburgerLines.length >= 3) {
      hamburgerLines[0].style.transform = 'translateY(8px) rotate(45deg)';
      hamburgerLines[1].style.opacity = '0';
      hamburgerLines[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    }
  } else {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    lenis.start();
    
    // Reset hamburger
    if (hamburgerLines.length >= 3) {
      hamburgerLines[0].style.transform = 'none';
      hamburgerLines[1].style.opacity = '1';
      hamburgerLines[2].style.transform = 'none';
    }
  }
}

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    toggleMobileMenu();
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });
}

// Preloader & Intro Animation
window.addEventListener('load', () => {
  const percentEl = document.querySelector('.preloader-percent');
  let progress = 0;
  
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress > 100) progress = 100;
    if (percentEl) percentEl.textContent = progress + '%';
    
    if (progress === 100) {
      clearInterval(interval);
      startIntro();
    }
  }, 60);
});

function startIntro() {
  const tl = gsap.timeline();
  
  tl.to('.preloader-text span', {
    y: 0,
    duration: 0.8,
    ease: 'power4.out'
  })
  .to('.preloader', {
    yPercent: -100,
    duration: 1,
    ease: 'power4.inOut',
    delay: 0.3
  })
  .to('.hero-title span', {
    y: 0,
    duration: 1,
    ease: 'power4.out',
    stagger: 0.1
  }, "-=0.4")
  .to('.hero-subtitle span, .hero-desc span', {
    y: 0,
    duration: 0.9,
    ease: 'power4.out',
    stagger: 0.1
  }, "-=0.7")
  .to('.hero-scroll', {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  }, "-=0.4");
}

// Responsive GSAP Animations
const mm = gsap.matchMedia();

// Desktop-Only Animations (Horizontal scroll & complex parallax)
mm.add("(min-width: 768px)", () => {
  // Hero Parallax
  gsap.to('.hero-img', {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Image Parallax Effect
  const parallaxImgs = document.querySelectorAll('.parallax-img');
  parallaxImgs.forEach(img => {
    gsap.to(img, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // Horizontal Scroll for Looks Showcase
  const horizontalScroll = document.querySelector('.horizontal-scroll-container');
  const looksSection = document.getElementById('looks-desktop');
  if (horizontalScroll && looksSection) {
    gsap.to(horizontalScroll, {
      x: () => -(horizontalScroll.scrollWidth - window.innerWidth + 80),
      ease: 'none',
      scrollTrigger: {
        trigger: looksSection,
        pin: true,
        start: 'top top',
        end: () => `+=${horizontalScroll.scrollWidth - window.innerWidth + 100}`,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  }
});

// Animations on All Screen Sizes
mm.add("all", () => {
  // Reveal Texts
  const revealElements = document.querySelectorAll('.reveal-text');
  revealElements.forEach(el => {
    gsap.fromTo(el, 
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
});

// Video Play/Pause Logic
const videoContainer = document.getElementById('video-container');
const video = document.getElementById('showreel-video');
const videoOverlay = document.getElementById('video-overlay');
const playBtn = document.getElementById('play-btn');

if (videoContainer && video) {
  videoContainer.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      video.muted = false;
      gsap.to(videoOverlay, { opacity: 0, duration: 0.3 });
      if (playBtn) {
        playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
      }
    } else {
      video.pause();
      gsap.to(videoOverlay, { opacity: 1, duration: 0.3 });
      if (playBtn) {
        playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
      }
    }
  });
}

// Contact Links Hover Animation (Desktop only)
if (!isTouchDevice) {
  const contactLinks = document.querySelectorAll('#contact li');
  contactLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, { x: 8, duration: 0.3, ease: 'power2.out' });
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(link, { x: 0, duration: 0.3, ease: 'power2.out' });
    });
  });
}

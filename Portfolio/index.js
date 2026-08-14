// Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
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

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows instantly
    gsap.set(cursorDot, {
      x: mouseX,
      y: mouseY
    });
  });

  // Outline follows with lag
  gsap.ticker.add(() => {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    
    gsap.set(cursorOutline, {
      x: outlineX,
      y: outlineY
    });
  });

  // Hover effects
  const interactables = document.querySelectorAll('a, button, .look-card, #video-container');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('hover-active');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hover-active');
    });
  });
}

// Preloader & Intro Animation
window.addEventListener('load', () => {
  const percentEl = document.querySelector('.preloader-percent');
  let progress = 0;
  
  // Fake loading progress
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress > 100) progress = 100;
    percentEl.textContent = progress + '%';
    
    if (progress === 100) {
      clearInterval(interval);
      startIntro();
    }
  }, 100);
});

function startIntro() {
  const tl = gsap.timeline();
  
  // Text reveal in preloader
  tl.to('.preloader-text span', {
    y: 0,
    duration: 1,
    ease: 'power4.out'
  })
  // Preloader slide up
  .to('.preloader', {
    yPercent: -100,
    duration: 1.2,
    ease: 'power4.inOut',
    delay: 0.5
  })
  // Hero text reveal
  .to('.hero-title span', {
    y: 0,
    duration: 1,
    ease: 'power4.out',
    stagger: 0.1
  }, "-=0.5")
  .to('.hero-subtitle span, .hero-desc span', {
    y: 0,
    duration: 1,
    ease: 'power4.out',
    stagger: 0.1
  }, "-=0.8")
  // Show scroll indicator
  .to('.hero-scroll', {
    opacity: 1,
    duration: 1,
    ease: 'power2.out'
  }, "-=0.5");
}

// Scroll Animations

// Hero Parallax
gsap.to('.hero-img', {
  yPercent: 30,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});

// Reveal Texts
const revealElements = document.querySelectorAll('.reveal-text');
revealElements.forEach(el => {
  gsap.fromTo(el, 
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});

// Image Parallax Effect
const parallaxImgs = document.querySelectorAll('.parallax-img');
parallaxImgs.forEach(img => {
  gsap.to(img, {
    yPercent: -15,
    ease: 'none',
    scrollTrigger: {
      trigger: img.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
});

// Horizontal Scroll for Looks (Desktop only)
const horizontalScroll = document.querySelector('.horizontal-scroll-container');
if (horizontalScroll) {
  let scrollWidth = horizontalScroll.scrollWidth;
  let windowWidth = window.innerWidth;
  
  // Recalculate on resize
  window.addEventListener('resize', () => {
    scrollWidth = horizontalScroll.scrollWidth;
    windowWidth = window.innerWidth;
  });

  gsap.to(horizontalScroll, {
    x: () => -(scrollWidth - windowWidth + 80), // 80px padding offset
    ease: 'none',
    scrollTrigger: {
      trigger: '#looks',
      pin: true,
      start: 'top top',
      end: () => `+=${scrollWidth}`,
      scrub: 1,
      invalidateOnRefresh: true,
      // Only apply on desktop
      matchMedia: "(min-width: 768px)"
    }
  });
}

// Video Play/Pause Logic
const videoContainer = document.getElementById('video-container');
const video = document.getElementById('showreel-video');
const videoOverlay = document.getElementById('video-overlay');
const playBtn = document.getElementById('play-btn');

if (videoContainer && video) {
  videoContainer.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      video.muted = false; // Unmute on click to play sound
      gsap.to(videoOverlay, { opacity: 0, duration: 0.3 });
      playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
    } else {
      video.pause();
      gsap.to(videoOverlay, { opacity: 1, duration: 0.3 });
      playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    }
  });
}

// Contact Links Hover Animation
const contactLinks = document.querySelectorAll('#contact li');
contactLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    gsap.to(link, { x: 10, duration: 0.3, ease: 'power2.out' });
  });
  link.addEventListener('mouseleave', () => {
    gsap.to(link, { x: 0, duration: 0.3, ease: 'power2.out' });
  });
});

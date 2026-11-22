document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".fade-in");
  
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
  
    sections.forEach(section => observer.observe(section));
  });

  // Back to Top
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) { // show after scrolling 300px
    backToTop.style.display = 'flex';
  } else {
    backToTop.style.display = 'none';
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// A small, optional stardust burst in the intro.
const stardustButton = document.getElementById('stardustButton');
if (stardustButton) {
  stardustButton.addEventListener('click', () => {
    const bounds = stardustButton.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const symbols = ['✦', '✧', '·', '✶'];

    for (let i = 0; i < 14; i += 1) {
      const spark = document.createElement('span');
      const angle = (Math.PI * 2 * i) / 14;
      const distance = 35 + Math.random() * 85;
      spark.className = 'stardust';
      spark.textContent = symbols[i % symbols.length];
      spark.setAttribute('aria-hidden', 'true');
      spark.style.left = `${centerX}px`;
      spark.style.top = `${centerY}px`;
      spark.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`);
      spark.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
      spark.style.setProperty('--spark-size', `${12 + Math.random() * 15}px`);
      spark.addEventListener('animationend', () => spark.remove(), { once: true });
      document.body.appendChild(spark);
      window.setTimeout(() => spark.remove(), 1400);
    }

    stardustButton.textContent = 'A little more cosmic ✨';
    window.setTimeout(() => {
      stardustButton.textContent = '✦ Sprinkle a little stardust';
    }, 1600);
  });
}

// Keep the service directory usable with a mouse, touch, or keyboard.
const serviceTabs = Array.from(document.querySelectorAll('.service-tab'));
const serviceBubble = document.getElementById('serviceBubble');
const serviceTitle = document.getElementById('serviceTitle');
const serviceCopy = document.getElementById('serviceCopy');

function selectServiceTab(tab, moveFocus = false) {
  if (!tab || !serviceBubble || !serviceTitle || !serviceCopy) return;
  serviceTabs.forEach(item => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });

  serviceBubble.setAttribute('aria-labelledby', tab.id);
  const bubbleRect = serviceBubble.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();
  const arrowX = Math.min(Math.max(tabRect.left + tabRect.width / 2 - bubbleRect.left - 8, 18), bubbleRect.width - 28);
  serviceBubble.style.setProperty('--bubble-arrow-x', `${arrowX}px`);
  serviceBubble.classList.add('updating');
  window.setTimeout(() => {
    serviceTitle.textContent = tab.dataset.title;
    serviceCopy.textContent = tab.dataset.copy;
    serviceBubble.classList.remove('updating');
  }, 130);

  if (moveFocus) {
    tab.focus();
    tab.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  }
}

serviceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectServiceTab(tab));
  tab.addEventListener('keydown', event => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % serviceTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + serviceTabs.length) % serviceTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = serviceTabs.length - 1;
    else return;
    event.preventDefault();
    selectServiceTab(serviceTabs[nextIndex], true);
  });
});

// Parallax is on by default unless the visitor prefers reduced motion.
// The fixed control lets them switch it off at any time; save their choice.
const motionToggle = document.getElementById('motionToggle');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionEnabled = !reducedMotionQuery.matches;
try {
  const savedMotion = window.localStorage.getItem('liacodev-parallax');
  if (savedMotion === 'on') motionEnabled = true;
  if (savedMotion === 'off') motionEnabled = false;
} catch (error) {
  // The visual control still works when storage is unavailable.
}

function updateParallax() {
  if (!motionEnabled) return;
  const scroll = window.scrollY || 0;
  document.body.style.setProperty('--stars-shift', `${-scroll * 0.16}px`);
  document.body.style.setProperty('--planet-shift', `${scroll * 0.1}px`);
}

function setParallax(enabled, remember = false) {
  motionEnabled = enabled;
  document.body.classList.toggle('motion-off', !motionEnabled);
  if (motionToggle) {
    motionToggle.querySelector('.motion-label').textContent = motionEnabled ? 'Motion on' : 'Motion off';
    motionToggle.setAttribute('aria-label', motionEnabled ? 'Turn off parallax' : 'Turn on parallax');
  }
  if (remember) {
    try { window.localStorage.setItem('liacodev-parallax', motionEnabled ? 'on' : 'off'); } catch (error) {}
  }
  if (motionEnabled) updateParallax();
  else {
    document.body.style.setProperty('--stars-shift', '0px');
    document.body.style.setProperty('--planet-shift', '0px');
  }
}

setParallax(motionEnabled);
if (motionToggle) motionToggle.addEventListener('click', () => setParallax(!motionEnabled, true));
let parallaxFrame = 0;
window.addEventListener('scroll', () => {
  if (!motionEnabled || parallaxFrame) return;
  parallaxFrame = window.requestAnimationFrame(() => {
    parallaxFrame = 0;
    updateParallax();
  });
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('testimonialCarousel');
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('carouselDots');
  
    if (!carousel || slides.length === 0) return;
  
    // Create dots
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Go to slide ${i+1}`);
      btn.addEventListener('click', () => {
        goToSlide(i);
        resetAutoSlide();
      });
      dotsContainer.appendChild(btn);
    });
  
    const dots = Array.from(dotsContainer.children);
    let index = 0;
    let intervalId = null;
    const SLIDE_DELAY = 4000; // ms
  
    function updateUI() {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      // update aria-hidden for slides (accessibility)
      slides.forEach((s, i) => s.setAttribute('aria-hidden', i === index ? 'false' : 'true'));
    }
  
    function goToSlide(i) {
      index = (i + slides.length) % slides.length;
      updateUI();
    }
  
    function nextSlide() {
      index = (index + 1) % slides.length;
      updateUI();
    }
  
    function startAutoSlide() {
      if (intervalId) return;
      intervalId = setInterval(nextSlide, SLIDE_DELAY);
    }
  
    function stopAutoSlide() {
      if (!intervalId) return;
      clearInterval(intervalId);
      intervalId = null;
    }
  
    function resetAutoSlide() {
      stopAutoSlide();
      startAutoSlide();
    }
  
    // Pause on hover/focus
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    carousel.addEventListener('focusin', stopAutoSlide);
    carousel.addEventListener('focusout', startAutoSlide);
  
    // Touch: simple swipe support
    let startX = 0;
    let isTouching = false;
    carousel.addEventListener('touchstart', e => {
      stopAutoSlide();
      isTouching = true;
      startX = e.touches[0].clientX;
    }, { passive: true });
  
    carousel.addEventListener('touchmove', e => {
      if (!isTouching) return;
      const dx = e.touches[0].clientX - startX;
      // small visual drag (optional), we won't implement a full dragging interaction here
    }, { passive: true });
  
    carousel.addEventListener('touchend', e => {
      if (!isTouching) return;
      const endX = e.changedTouches[0].clientX;
      const dx = endX - startX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) nextSlide();
        else goToSlide((index - 1 + slides.length) % slides.length);
      }
      isTouching = false;
      resetAutoSlide();
    });
  
    // init
    updateUI();
    startAutoSlide();
  });


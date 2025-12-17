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

// Adjust this number to how many websites you've completed
const currentWebsites = 24;
const goal = 200;

const percentage = (currentWebsites / goal) * 100;

document.getElementById("currentCount").textContent = currentWebsites;
document.getElementById("progressFill").style.width = percentage + "%";

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


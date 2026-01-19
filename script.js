// Small helper scripts: mobile menu, lightbox, form handling
const mobileMenu = document.getElementById('mobile-menu');
const mobileToggle = document.querySelector('.mobile-toggle');

function toggleMenu(btn, event){
  if(event) event.stopPropagation();
  const menu = document.getElementById('mobile-menu');
  const open = menu.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-hidden', !open);
  
  if (open) {
    // Move focus to first menu link
    const firstLink = menu.querySelector('a');
    if (firstLink) firstLink.focus();
  }
}

function closeMenu(){
  const btn = document.querySelector('.mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  if (menu.classList.contains('open')) {
    menu.classList.remove('open');
    if(btn) {
      btn.setAttribute('aria-expanded', false);
      btn.focus(); // Move focus back to button
    }
    menu.setAttribute('aria-hidden', true);
  }
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobile-menu');
  const btn = document.querySelector('.mobile-toggle');
  if (menu.classList.contains('open') && !menu.contains(e.target) && e.target !== btn) {
    closeMenu();
  }
});
function contactFromMenu(){
  closeMenu();
  document.getElementById('contact').scrollIntoView({behavior:'smooth'});
}

// Carousel functionality
const carousel = {
  view: document.querySelector('.carousel-view img'),
  caption: document.querySelector('.carousel-caption'),
  thumbs: document.querySelectorAll('.thumb'),
  navPrev: document.querySelector('.carousel-nav.prev'),
  navNext: document.querySelector('.carousel-nav.next'),
  currentIndex: 0,
  
  init() {
    this.thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => this.showImage(index));
    });
    
    this.navPrev.addEventListener('click', () => this.navigate(-1));
    this.navNext.addEventListener('click', () => this.navigate(1));
    
    // Enable lightbox on main image click
    this.view.parentElement.setAttribute('tabindex', '0');
    this.view.parentElement.setAttribute('role', 'button');
    this.view.parentElement.setAttribute('aria-label', 'Open image in large view');
    this.view.parentElement.addEventListener('click', () => {
      openLightbox(this.currentIndex);
    });
    this.view.parentElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(this.currentIndex);
      }
    });
    
    // Keyboard navigation for carousel
    document.addEventListener('keydown', (e) => {
      // Only navigate if the carousel or a thumb is focused
      if (document.activeElement.closest('.carousel')) {
        if (e.key === 'ArrowLeft') this.navigate(-1);
        if (e.key === 'ArrowRight') this.navigate(1);
      }
    });
    
    // Update lightbox sources
    this.updateLightboxSources();
  },
  
  showImage(index) {
    this.currentIndex = index;
    const thumb = this.thumbs[index];
    const newSrc = thumb.dataset.src;
    const newCaption = thumb.dataset.caption;
    
    this.view.src = newSrc;
    if (this.caption) {
      this.caption.textContent = newCaption;
    }
    
    // Update active thumbnail
    this.thumbs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    this.thumbs[index].classList.add('active');
    this.thumbs[index].setAttribute('aria-selected', 'true');
    
    // Scroll thumbnail into view if needed
    this.thumbs[index].scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  },
  
  navigate(direction) {
    let newIndex = this.currentIndex + direction;
    if (newIndex < 0) newIndex = this.thumbs.length - 1;
    if (newIndex >= this.thumbs.length) newIndex = 0;
    this.showImage(newIndex);
  },
  
  updateLightboxSources() {
    // Update lightbox image sources
    gallerySrcs = Array.from(this.thumbs).map(thumb => thumb.dataset.src);
  }
};

// Initialize carousel when page loads
window.addEventListener('load', () => carousel.init());

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
let gallerySrcs = [];

function openLightbox(i){
  lbImg.src = gallerySrcs[i] || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', false);
  lightbox.focus(); // Move focus to lightbox
}

function closeLightbox(){
  if (lightbox.classList.contains('open')) {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', true);
    // Move focus back to the main carousel view
    carousel.view.parentElement.focus();
  }
}

// small runtime niceties
document.getElementById('year').textContent = new Date().getFullYear();

// Accessibility: close lightbox with Esc
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ closeLightbox(); closeMenu(); } });

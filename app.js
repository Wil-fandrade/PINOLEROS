import { products, designs, heroSlides } from './src/data/products.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const toast = document.querySelector('[data-toast]');
let toastTimer;
let heroIndex = 0;
let heroTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function renderProducts(filter = 'all') {
  const grid = document.querySelector('[data-products-grid]');
  grid.innerHTML = products.map((product, index) => {
    const hidden = filter !== 'all' && product.category !== filter ? ' is-hidden' : '';
    return `<article class="product-card${hidden}" data-category="${product.category}" style="animation-delay:${index * 45}ms"><a class="product-image-link" href="#contacto" data-product-name="${product.name}"><img data-reveal-image src="${product.image}" alt="${product.alt}" width="1000" height="1250" loading="lazy" /><span class="product-custom-print product-print-${product.id}" aria-hidden="true"><strong>${product.shortName}</strong><span>${product.id === 'mugs' ? 'DAILY / 01' : 'PINOLEROS / 26'}</span></span><span class="product-arrow" aria-hidden="true">↗</span><span class="image-print-label">Listo para imprimir</span></a><div class="product-meta"><div><p class="product-kind">${String(index + 1).padStart(2, '0')} / ${product.technology}</p><h3>${product.name}</h3></div><span class="product-price">${product.price}</span></div><p class="product-description">${product.description}</p></article>`;
  }).join('');
  grid.querySelectorAll('[data-product-name]').forEach((link) => link.addEventListener('click', () => showToast(`Elegiste ${link.dataset.productName}. Cuéntanos cómo lo quieres.`)));
}

function renderDesigns(type = 'Todos', query = '') {
  const grid = document.querySelector('[data-design-grid]');
  const normalizedQuery = query.trim().toLowerCase();
  const visible = designs.filter((design) => (type === 'Todos' || design.type === type) && (!normalizedQuery || `${design.title} ${design.type}`.toLowerCase().includes(normalizedQuery)));
  grid.innerHTML = visible.map((design, index) => `<article class="design-card" style="animation-delay:${index * 45}ms"><div class="design-art ${design.className}"><strong>${design.mark}</strong><span>${design.sub}</span></div><button type="button" aria-label="Imprimir diseño ${design.title}" data-design-name="${design.title}">↗</button></article>`).join('');
  document.querySelector('[data-design-count]').textContent = visible.length;
  grid.querySelectorAll('[data-design-name]').forEach((button) => button.addEventListener('click', () => showToast(`“${button.dataset.designName}” está listo para imprimir.`)));
}

renderProducts();
renderDesigns();

function updateHero(index, direction = 1) {
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  const slide = heroSlides[heroIndex];
  const image = document.querySelector('[data-hero-image]');
  const product = document.querySelector('[data-hero-slider]');
  image.classList.add('is-sliding');
  product.style.setProperty('--hero-accent', `var(--${slide.accent})`);
  window.setTimeout(() => {
    image.src = slide.image;
    image.alt = slide.alt;
    document.querySelector('[data-hero-name]').textContent = slide.product;
    document.querySelector('[data-hero-detail]').textContent = slide.detail;
    document.querySelector('[data-hero-counter]').textContent = `${String(heroIndex + 1).padStart(2, '0')} / 03 · Selección de hoy`;
    document.querySelector('[data-hero-pill]').textContent = heroIndex === 0 ? 'Nuevo drop' : 'Más elegido';
    image.classList.remove('is-sliding');
  }, reducedMotion ? 0 : 260);
  document.querySelectorAll('[data-hero-progress] span').forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === heroIndex));
}

function restartHero() {
  window.clearInterval(heroTimer);
  if (!reducedMotion) heroTimer = window.setInterval(() => updateHero(heroIndex + 1), 5200);
}

document.querySelector('[data-hero-prev]').addEventListener('click', () => { updateHero(heroIndex - 1, -1); restartHero(); });
document.querySelector('[data-hero-next]').addEventListener('click', () => { updateHero(heroIndex + 1); restartHero(); });
restartHero();

document.querySelectorAll('[data-product-filter]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-product-filter]').forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  renderProducts(button.dataset.productFilter);
}));

document.querySelectorAll('[data-design-filter]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-design-filter]').forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  renderDesigns(button.dataset.designFilter, document.querySelector('[data-design-search]').value);
}));

document.querySelector('[data-design-search]').addEventListener('input', (event) => {
  const activeFilter = document.querySelector('[data-design-filter].is-active').dataset.designFilter;
  renderDesigns(activeFilter, event.target.value);
});

document.querySelector('[data-load-more]').addEventListener('click', () => showToast('Estamos preparando una nueva colección de diseños.'));

document.querySelector('.menu-toggle').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const isOpen = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!isOpen));
  document.body.classList.toggle('menu-open', !isOpen);
});
document.querySelectorAll('.mobile-menu a').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

const header = document.querySelector('[data-header]');
window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 18), { passive: true });

const cursor = document.querySelector('[data-cursor]');
if (cursor && window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
  window.addEventListener('pointermove', (event) => { cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px`; }, { passive: true });
  document.querySelectorAll('a, button').forEach((element) => {
    element.addEventListener('mouseenter', () => cursor.classList.add('is-visible'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
  });
}

document.querySelectorAll('img').forEach((image) => image.addEventListener('error', () => image.setAttribute('alt', 'Imagen no disponible')));

if ('IntersectionObserver' in window && !reducedMotion) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .18 });
  document.querySelectorAll('[data-reveal-image], .inspiration-images img, .design-card').forEach((element) => imageObserver.observe(element));
}

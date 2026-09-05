import { products, processSteps } from './src/data/products.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lab = document.querySelector('[data-lab]');
const labTabs = document.querySelector('.lab-tabs');
const labImage = document.querySelector('[data-lab-image]');
const labName = document.querySelector('[data-lab-name]');
const labDescription = document.querySelector('[data-lab-description]');
const labStep = document.querySelector('[data-lab-step]');
const labTech = document.querySelector('[data-lab-tech]');
const storyImage = document.querySelector('[data-story-image]');
let activeProduct = 0;
let storyStage = 0;
let rotationTimer;

function renderLabTabs() {
  labTabs.innerHTML = products.map((product, index) => `<button class="lab-tab ${index === 0 ? 'is-active' : ''}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="lab-visual" data-product-index="${index}" data-accent="${product.accent}">${product.shortName}</button>`).join('');
  labTabs.querySelectorAll('.lab-tab').forEach((tab) => tab.addEventListener('click', () => selectProduct(Number(tab.dataset.productIndex), true)));
}

function selectProduct(index, userInitiated = false) {
  activeProduct = index;
  const product = products[index];
  lab.style.setProperty('--active-accent', `var(--color-${product.accent})`);
  labImage.classList.add('is-changing');
  window.setTimeout(() => {
    labImage.src = product.image;
    labImage.alt = product.alt;
    labName.textContent = product.name;
    labDescription.textContent = product.description;
    labStep.textContent = `01 / ${product.name} blank`;
    labTech.textContent = product.technology;
    labImage.classList.remove('is-changing');
  }, reducedMotion ? 0 : 220);
  labTabs.querySelectorAll('.lab-tab').forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  if (userInitiated) restartRotation();
}

function restartRotation() {
  window.clearInterval(rotationTimer);
  if (!reducedMotion) rotationTimer = window.setInterval(() => selectProduct((activeProduct + 1) % products.length), 6500);
}

function renderProcess() {
  document.querySelector('[data-process-rail]').innerHTML = processSteps.map((step) => `<article class="process-step"><span>${step.number}</span><h3>${step.title}</h3><p>${step.copy}</p></article>`).join('');
}

function renderProducts() {
  document.querySelector('[data-products-grid]').innerHTML = products.map((product, index) => `<article class="product-card" data-accent="${product.accent}"><a class="product-image-link" href="#start" data-product-index="${index}"><img src="${product.image}" alt="${product.alt}" width="1000" height="1250" loading="lazy" /><span class="product-arrow" aria-hidden="true">↗</span></a><div class="product-meta"><div><p class="product-kind">${String(index + 1).padStart(2, '0')} / ${product.technology}</p><h3>${product.name}</h3></div><span>${product.price}</span></div><p class="product-description">${product.description}</p></article>`).join('');
  document.querySelectorAll('.product-image-link').forEach((link) => link.addEventListener('mouseenter', () => selectProduct(Number(link.dataset.productIndex), true)));
}

function advanceStory() {
  const stages = [...document.querySelectorAll('.story-stage')];
  storyStage = (storyStage + 1) % stages.length;
  stages.forEach((stage, index) => stage.classList.toggle('is-active', index === storyStage));
  storyImage.classList.add('is-changing');
  window.setTimeout(() => storyImage.classList.remove('is-changing'), reducedMotion ? 0 : 240);
}

renderLabTabs();
renderProcess();
renderProducts();
document.querySelector('[data-story-next]').addEventListener('click', advanceStory);
restartRotation();

document.querySelector('.menu-toggle').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  document.body.classList.toggle('menu-open', !open);
});
document.querySelectorAll('.mobile-menu a').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

const header = document.querySelector('[data-header]');
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const cursor = document.querySelector('[data-cursor]');
if (cursor && window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
  window.addEventListener('pointermove', (event) => { cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`; }, { passive: true });
  document.querySelectorAll('a, button').forEach((element) => {
    element.addEventListener('mouseenter', () => cursor.classList.add('is-visible'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
  });
}

document.querySelectorAll('img').forEach((image) => image.addEventListener('error', () => image.classList.add('image-error')));

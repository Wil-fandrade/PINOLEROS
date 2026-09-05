document.querySelectorAll('img').forEach((image) => {
  image.addEventListener('error', () => {
    image.closest('figure, .product-image-link, .process-image-wrap')?.classList.add('image-error');
  });
});
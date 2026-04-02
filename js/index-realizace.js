const realizaceCategories = [
  { name: 'Elektro služby',                folder: 'Elektro',                coverPhoto: 'WhatsApp Image 2026-04-02 at 12.14.07 (1).jpeg' },
  { name: 'Vodoinstalace a topení',         folder: 'VodoinstalaceTopeni',    coverPhoto: 'IMG_0038.JPG' },
  { name: 'Pokrývačské a klempířské práce', folder: 'PokryvacskeKlempirske',  coverPhoto: 'WhatsApp Image 2026-04-02 at 13.33.23.jpeg' },
  { name: 'Sádrokartonářské práce',         folder: 'Sadrokarton',            coverPhoto: 'WhatsApp Image 2026-04-02 at 13.49.50 (1).jpeg' },
  { name: 'Montáž kuchyní',                 folder: 'Kuchyne',                coverPhoto: 'WhatsApp Image 2026-03-29 at 20.09.32.jpeg' },
  { name: 'Obklady, dlažby a koupelny',     folder: 'ObkladyDlazbyKoupelny',  coverPhoto: 'WhatsApp Image 2026-04-02 at 14.10.52.jpeg' },
  { name: 'Ostatní práce',                  folder: 'Ostatni',                coverPhoto: 'WhatsApp Image 2026-03-29 at 20.06.14.jpeg' },
];

// coverPhoto: set to a specific filename (e.g. "WhatsApp Image 2026-03-29 at 19.43.21.jpeg")
// or leave as null to use the first image in the folder

function imgSrc(folder, filename) {
  return 'images/realizace/' + encodeURIComponent(folder) + '/' + encodeURIComponent(filename);
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('realizace-grid');
  if (!grid || typeof realizacePhotos === 'undefined') return;

  realizaceCategories.forEach(cat => {
    const images = realizacePhotos[cat.folder] || [];
    if (!images.length) return;

    const cover = cat.coverPhoto || images[0];

    const card = document.createElement('div');
    card.className = 'realizace-card';
    card.innerHTML = `
      <img src="${imgSrc(cat.folder, cover)}" alt="${cat.name}" loading="lazy">
      <div class="realizace-card-overlay">
        <span class="realizace-card-tag">${cat.name}</span>
        <span class="realizace-card-hint"><i class="fa-solid fa-images"></i> ${images.length} fotografií</span>
      </div>
    `;
    card.addEventListener('click', () => openLightbox(cat.folder, 0));
    grid.appendChild(card);
  });

  // Lightbox
  const lightbox = document.getElementById('rlb-lightbox');
  const lbImg = document.getElementById('rlb-img');
  const lbCounter = document.getElementById('rlb-counter');
  let activeFolder = null;
  let activeImages = [];
  let currentIndex = 0;

  function openLightbox(folder, idx) {
    activeFolder = folder;
    activeImages = realizacePhotos[folder] || [];
    currentIndex = idx;
    showImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showImage() {
    lbImg.src = imgSrc(activeFolder, activeImages[currentIndex]);
    lbImg.alt = `Realizace ${currentIndex + 1}`;
    lbCounter.textContent = `${currentIndex + 1} / ${activeImages.length}`;
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + activeImages.length) % activeImages.length;
    showImage();
  }

  document.getElementById('rlb-close').addEventListener('click', closeLightbox);
  document.getElementById('rlb-prev').addEventListener('click', () => navigate(-1));
  document.getElementById('rlb-next').addEventListener('click', () => navigate(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
});

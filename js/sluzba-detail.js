document.addEventListener('DOMContentLoaded', () => {
    // Získání ID služby z URL (např. sluzba-detail.html?id=elektroinstalace)
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');

    // Kontrola existence dat pro id
    if (!serviceId || typeof servicesData === 'undefined' || !servicesData[serviceId]) {
        // Zobrazení chyby na místě detailu
        document.querySelector('main').innerHTML = `
            <div style="text-align:center; padding: 150px 20px;">
                <h1>Služba nebyla nalezena</h1>
                <p style="margin: 20px 0; color: #666;">Omlouváme se, detail pro hledanou službu není dostupný.</p>
                <a href="sluzby.html" class="btn btn-accent">Prozkoumat naše služby</a>
            </div>
        `;
        return;
    }

    const data = servicesData[serviceId];

    // Nastavení hlavičky stránky
    document.title = `${data.title} Ústí nad Labem | Jan Jakubec | 777 640 940`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', `${data.title} v Ústí nad Labem – ${data.descriptionText.substring(0, 90).trimEnd()}... Zavolejte: 777 640 940 (+420 777 640 940).`);
    }
    
    // Vyplnění Hero sekce
    setTextContent('detail-label', data.label);
    setTextContent('detail-title', data.title);
    setTextContent('detail-desc-1', data.descriptionText);
    
    const imgEl = document.getElementById('detail-image');
    if (imgEl) {
        imgEl.src = data.image;
        imgEl.alt = data.title;
    }
    
    // Vyplnění Mřížky (Features)
    const featuresContainer = document.getElementById('detail-features');
    if (featuresContainer && data.features) {
        featuresContainer.innerHTML = '';
        data.features.forEach(feature => {
            const card = document.createElement('div');
            card.className = 'sd-feature-card';
            card.innerHTML = `
                <div class="sd-feature-icon"><i class="fa-solid fa-check"></i></div>
                <h3>${feature}</h3>
            `;
            featuresContainer.appendChild(card);
        });
    }

    // Nastavení odkazu na kontaktní formulář
    const cta1 = document.getElementById('detail-cta-link-1');
    if(cta1) cta1.href = `kontakt.html?service=${serviceId}`;

    // Galerie realizací
    const galleryContainer = document.getElementById('detail-gallery');
    const moreWrap = document.getElementById('gallery-more-wrap');
    const moreBtn = document.getElementById('gallery-more-btn');
    const images = (typeof realizacePhotos !== 'undefined' && data.realizaceFolder)
        ? (realizacePhotos[data.realizaceFolder] || [])
        : [];

    if (galleryContainer && images.length > 0) {
        const folder = 'images/realizace/' + data.realizaceFolder;
        const initialCount = 8;

        function imgSrc(filename) {
            return folder.split('/').map(encodeURIComponent).join('/') + '/' + encodeURIComponent(filename);
        }

        function renderGallery(count) {
            galleryContainer.innerHTML = '';
            images.slice(0, count).forEach((filename, idx) => {
                const item = document.createElement('div');
                item.className = 'sd-gallery-item';
                item.innerHTML = `<img src="${imgSrc(filename)}" alt="Realizace ${idx + 1}" loading="lazy">`;
                item.addEventListener('click', () => openLightbox(idx));
                galleryContainer.appendChild(item);
            });
        }

        renderGallery(images.length <= initialCount ? images.length : initialCount);

        if (images.length > initialCount) {
            moreWrap.style.display = 'flex';
            moreBtn.addEventListener('click', () => {
                renderGallery(images.length);
                moreWrap.style.display = 'none';
            });
        }

        // Lightbox
        const lightbox = document.getElementById('sd-lightbox');
        const lbImg = document.getElementById('sd-lb-img');
        const lbCounter = document.getElementById('sd-lb-counter');
        let currentIndex = 0;

        function openLightbox(idx) {
            currentIndex = idx;
            lbImg.src = imgSrc(images[currentIndex]);
            lbImg.alt = `Realizace ${currentIndex + 1}`;
            lbCounter.textContent = `${currentIndex + 1} / ${images.length}`;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function navigate(dir) {
            currentIndex = (currentIndex + dir + images.length) % images.length;
            lbImg.src = imgSrc(images[currentIndex]);
            lbImg.alt = `Realizace ${currentIndex + 1}`;
            lbCounter.textContent = `${currentIndex + 1} / ${images.length}`;
        }

        document.getElementById('sd-lb-close').addEventListener('click', closeLightbox);
        document.getElementById('sd-lb-prev').addEventListener('click', () => navigate(-1));
        document.getElementById('sd-lb-next').addEventListener('click', () => navigate(1));
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });
    }
});

function setTextContent(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

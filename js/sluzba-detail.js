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
});

function setTextContent(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

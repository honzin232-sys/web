document.addEventListener('DOMContentLoaded', async function () {
  const navPlaceholder = document.getElementById('navbar-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  if (navPlaceholder) {
    const res = await fetch('components/navbar.html');
    navPlaceholder.outerHTML = await res.text();
  }

  if (footerPlaceholder) {
    const res = await fetch('components/footer.html');
    footerPlaceholder.outerHTML = await res.text();
  }

  const btn = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-links');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
});
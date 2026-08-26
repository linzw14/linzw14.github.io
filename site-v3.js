const pages = [
  ['index.html', 'Home', '首页'],
  ['research.html', 'Research', '研究'],
  ['people.html', 'People', '团队'],
  ['publications.html', 'Publications', '论文'],
  ['join.html', 'Join us', '加入我们']
];

/* Westlake University lockup, shown in the header and in the homepage hero.
   The CSS constrains height only — it never recolors, fades, or stretches the
   mark, so the asset renders as its visual identity guidelines require.

   UNIVERSITY_LOGO_ZH is for the bilingual lockup (西湖大學 + WESTLAKE
   UNIVERSITY). Set it to that file's name and the Chinese version of the site
   picks it up automatically; while it is null both languages use the English
   lockup. Set either to null to drop that placement entirely. */
const UNIVERSITY_LOGO = 'westlake-logo.png';
const UNIVERSITY_LOGO_ZH = null;

const SPARK = `<svg viewBox="0 0 52 32" fill="none" aria-hidden="true">
  <path d="M1 20 H10 l3-9 4 16 3-22 4 26 3-17 3 6 h21" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
</svg>`;

const current = location.pathname.split('/').pop() || 'index.html';
let language = 'en';
try {
  const saved = localStorage.getItem('linlab-language');
  language = saved || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en');
} catch (e) {}

function label(en, zh) { return language === 'zh' ? zh : en; }

function renderChrome() {
  const uniHome = language === 'zh' ? 'https://www.westlake.edu.cn/' : 'https://en.westlake.edu.cn/';
  const uniLogo = language === 'zh' ? (UNIVERSITY_LOGO_ZH || UNIVERSITY_LOGO) : UNIVERSITY_LOGO;
  const uniName = label('Westlake University', '西湖大学');

  const header = document.querySelector('[data-site-header]');
  if (header) {
    const headerAffil = uniLogo
      ? `<a class="header-affil" href="${uniHome}" target="_blank" rel="noopener"><img src="${uniLogo}" alt="${uniName}"></a>`
      : '';
    header.innerHTML = `
      <a class="brand" href="index.html" aria-label="The Lin Lab home">
        <span class="brand-mark">${SPARK}</span><span><b>The Lin Lab</b><small><span class="brand-uni">${uniName}</span><span class="brand-school">${label('School of Engineering', '工学院')}</span></small></span>
      </a>
      ${headerAffil}
      <button class="menu-toggle" aria-expanded="false" aria-label="Menu">${label('Menu', '菜单')}</button>
      <nav>${pages.map(([href,en,zh]) => `<a href="${href}" ${current === href ? 'aria-current="page"' : ''}>${label(en,zh)}</a>`).join('')}</nav>
      <button class="language-toggle" type="button">${language === 'en' ? '中文' : 'EN'}</button>`;
    const menu = header.querySelector('.menu-toggle');
    menu.addEventListener('click', () => {
      const open = header.classList.toggle('menu-open');
      menu.setAttribute('aria-expanded', String(open));
    });
    header.querySelector('.language-toggle').addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));
  }

  let skip = document.querySelector('.skip-link');
  if (!skip) {
    skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#main';
    document.body.prepend(skip);
  }
  skip.textContent = label('Skip to content', '跳到主要内容');

  const footer = document.querySelector('[data-site-footer]');
  if (!footer) return;

  // Already shown in the header and hero; the footer keeps a text affiliation
  // instead so the mark is not repeated three times on one screen.
  footer.innerHTML = `
    <div><a class="footer-brand" href="index.html">The Lin Lab</a><p>${label('Intelligent Brain–Computer Interfaces and Bioelectronics Laboratory', '智能脑机接口与生物电子实验室')}</p></div>
    <div><p>${label('School of Engineering · Westlake University', '西湖大学工学院')}</p><p>${label('600 Dunyu Road, Hangzhou, China 310030', '浙江省杭州市西湖区墩余路600号，310030')}</p></div>
    <div><a href="mailto:linzuwan@westlake.edu.cn">linzuwan@westlake.edu.cn</a><p><a href="https://www.westlake.edu.cn/faculty/zuwan-lin.html" target="_blank" rel="noopener">${label('Westlake faculty profile ↗', '西湖大学教师主页 ↗')}</a></p><p><a href="https://github.com/linzw14" target="_blank" rel="noopener">GitHub</a> · <a href="https://www.linkedin.com/in/zuwan-lin-545b1b214/" target="_blank" rel="noopener">LinkedIn</a></p><p>© ${new Date().getFullYear()} The Lin Lab</p></div>`;

  // The hero lockup lives in index.html so it paints without waiting on JS;
  // only its src and link need to follow the active language.
  const heroAffil = document.querySelector('.hero-affil');
  if (heroAffil) {
    heroAffil.href = uniHome;
    const heroLogo = heroAffil.querySelector('img');
    if (uniLogo) { heroLogo.src = uniLogo; heroLogo.alt = uniName; }
    else heroAffil.remove();
  }
}

function setLanguage(next) {
  language = next;
  try { localStorage.setItem('linlab-language', language); } catch (e) {}
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-en][data-zh]').forEach(el => {
    el.innerHTML = el.dataset[language];
  });
  renderChrome();
}

/* Scroll reveal. Purely additive: the .reveal class that hides an element is
   applied from here, so with JS off (or reduced motion on) everything renders
   visible as normal. */
function initReveal() {
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';

  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll(
    '.pillar-card, .feature, .more-row, .news-item, .align-strip, .program, ' +
    '.publication, .pub-category-head, .join-card, .value, .recruit-card, ' +
    '.contact-box, .pi-grid, .northstar .wrap'
  );
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });

  const set = new Set(targets);
  targets.forEach(el => {
    // Cascade siblings in a grid or list rather than popping them in together.
    let step = 0;
    for (let prev = el.previousElementSibling; prev; prev = prev.previousElementSibling) {
      if (set.has(prev)) step++;
    }
    el.classList.add('reveal');
    if (step) el.style.transitionDelay = Math.min(step, 5) * 70 + 'ms';
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setLanguage(language);
  initReveal();
});

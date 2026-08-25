const pages = [
  ['index.html', 'Home', '首页'],
  ['research.html', 'Research', '研究'],
  ['people.html', 'People', '团队'],
  ['publications.html', 'Publications', '论文'],
  ['join.html', 'Join us', '加入我们']
];

const current = location.pathname.split('/').pop() || 'index.html';
const savedLanguage = localStorage.getItem('linlab-language');
let language = savedLanguage || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en');

function label(en, zh) { return language === 'zh' ? zh : en; }

function renderChrome() {
  const header = document.querySelector('[data-site-header]');
  if (header) {
    header.innerHTML = `
      <a class="brand" href="index.html" aria-label="The Lin Lab home">
        <span class="brand-mark">L</span><span><b>The Lin Lab</b><small>${label('Westlake University', '西湖大学')}</small></span>
      </a>
      <button class="menu-toggle" aria-expanded="false" aria-label="Menu">Menu</button>
      <nav>${pages.map(([href,en,zh]) => `<a href="${href}" ${current === href ? 'aria-current="page"' : ''}>${label(en,zh)}</a>`).join('')}</nav>
      <button class="language-toggle" type="button">${language === 'en' ? '中文' : 'EN'}</button>`;
    const menu = header.querySelector('.menu-toggle');
    menu.addEventListener('click', () => {
      const open = header.classList.toggle('menu-open');
      menu.setAttribute('aria-expanded', String(open));
    });
    header.querySelector('.language-toggle').addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));
  }

  const footer = document.querySelector('[data-site-footer]');
  if (footer) footer.innerHTML = `
    <div><a class="footer-brand" href="index.html">The Lin Lab</a><p>${label('Intelligent Brain–Computer Interfaces and Bioelectronics Laboratory', '智能脑机接口与生物电子实验室')}</p></div>
    <div><p>${label('School of Engineering · Westlake University', '西湖大学工学院')}</p><p>${label('600 Dunyu Road, Hangzhou, China 310030', '浙江省杭州市西湖区墩余路600号，310030')}</p></div>
    <div><a href="mailto:linzuwan@westlake.edu.cn">linzuwan@westlake.edu.cn</a><p>© ${new Date().getFullYear()} The Lin Lab</p></div>`;
}

function setLanguage(next) {
  language = next;
  localStorage.setItem('linlab-language', language);
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-en][data-zh]').forEach(el => {
    el.innerHTML = el.dataset[language];
  });
  renderChrome();
}

document.addEventListener('DOMContentLoaded', () => setLanguage(language));

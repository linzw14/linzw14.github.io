const pages = [
  ['index.html', 'Home', '首页'],
  ['research.html', 'Research', '研究'],
  ['people.html', 'People', '团队'],
  ['publications.html', 'Publications', '论文'],
  ['join.html', 'Join us', '加入我们']
];

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
  const header = document.querySelector('[data-site-header]');
  if (header) {
    header.innerHTML = `
      <a class="brand" href="index.html" aria-label="The Lin Lab home">
        <span class="brand-mark">${SPARK}</span><span><b>The Lin Lab</b><small>${label('Westlake University', '西湖大学')}</small></span>
      </a>
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

  const footer = document.querySelector('[data-site-footer]');
  if (footer) footer.innerHTML = `
    <div><a class="footer-brand" href="index.html">The Lin Lab</a><p>${label('Intelligent Brain–Computer Interfaces and Bioelectronics Laboratory', '智能脑机接口与生物电子实验室')}</p></div>
    <div><p>${label('School of Engineering · Westlake University', '西湖大学工学院')}</p><p>${label('600 Dunyu Road, Hangzhou, China 310030', '浙江省杭州市西湖区墩余路600号，310030')}</p></div>
    <div><a href="mailto:linzuwan@westlake.edu.cn">linzuwan@westlake.edu.cn</a><p><a href="https://www.westlake.edu.cn/faculty/zuwan-lin.html" target="_blank" rel="noopener">${label('Westlake faculty profile ↗', '西湖大学教师主页 ↗')}</a></p><p><a href="https://github.com/linzw14" target="_blank" rel="noopener">GitHub</a> · <a href="https://www.linkedin.com/in/zuwan-lin-545b1b214/" target="_blank" rel="noopener">LinkedIn</a></p><p>© ${new Date().getFullYear()} The Lin Lab</p></div>`;
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

document.addEventListener('DOMContentLoaded', () => setLanguage(language));

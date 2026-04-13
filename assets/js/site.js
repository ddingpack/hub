(() => {
  const root = document.documentElement;
  const currentPath = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('ddingpack-theme', theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      const isDark = theme === 'dark';
      const label = isDark ? '다크 모드' : '라이트 모드';
      const icon = isDark ? '🌙' : '☀️';
      const iconEl = btn.querySelector('.mode-icon');
      const labelEl = btn.querySelector('.mode-label');
      if (iconEl) iconEl.textContent = icon;
      if (labelEl) labelEl.textContent = label;
      btn.setAttribute('aria-label', label);
    });
  }

  setTheme(localStorage.getItem('ddingpack-theme') || 'dark');
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  });

  const menuBtn = document.querySelector('[data-menu-open]');
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.querySelector('.sidebar-backdrop');
  const closeMenu = () => {
    sidebar?.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
  };
  menuBtn?.addEventListener('click', () => {
    if (window.innerWidth <= 980) {
      sidebar?.classList.add('is-open');
      backdrop?.classList.add('is-open');
    }
  });
  backdrop?.addEventListener('click', closeMenu);

  const assist = document.querySelector('[data-assist-open]') ? document.getElementById('assist-panel') : null;
  const assistBackdrop = document.querySelector('[data-assist-backdrop]');
  const openAssist = () => { assist?.classList.add('is-open'); assistBackdrop?.classList.add('is-open'); };
  const closeAssist = () => { assist?.classList.remove('is-open'); assistBackdrop?.classList.remove('is-open'); };
  document.querySelectorAll('[data-assist-open]').forEach((btn) => btn.addEventListener('click', openAssist));
  document.querySelectorAll('[data-assist-close]').forEach((btn) => btn.addEventListener('click', closeAssist));
  assistBackdrop?.addEventListener('click', closeAssist);
  document.querySelectorAll('.nav-link, .rail-link, .utility-button, .rail-brand').forEach((el) => {
    el.addEventListener('click', () => {
      if (window.innerWidth <= 980) closeMenu();
      closeAssist();
    });
  });

  function resolveActiveKey() {
    if (currentPath === 'download.html') return 'download';
    if (currentPath === 'install-guide.html') return 'guide';
    if (currentPath === 'allowed-mods.html') return 'mods';
    if (currentPath === 'notice.html' || currentPath === 'notice-beta-open.html') return 'notice';
    if (currentPath === 'faq.html') return 'faq';
    if (currentPath === 'privacy.html') return 'privacy';
    if (currentPath === 'terms.html') return 'terms';
    return 'home';
  }

  const activeKey = resolveActiveKey();
  document.querySelectorAll('[data-nav-key]').forEach((el) => {
    const match = el.dataset.navKey === activeKey;
    el.classList.toggle('is-current', match);
    if (match) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-rail-key]').forEach((el) => {
    const match = el.dataset.railKey === activeKey;
    el.classList.toggle('is-active', match);
    if (match) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
  if (activeKey === 'home') {
    document.querySelector('.rail-brand')?.classList.add('is-active');
  }

  const overlay = document.querySelector('[data-welcome-overlay]');
  const shouldForceWelcome = currentPath === 'index.html' && new URLSearchParams(location.search).get('welcome') === '1';
  const openWelcome = () => {
    if (!overlay) return;
    overlay.classList.remove('is-hidden');
    document.body.classList.add('welcome-open');
  };
  const closeWelcome = () => {
    if (!overlay) return;
    overlay.classList.add('is-hidden');
    document.body.classList.remove('welcome-open');
    localStorage.setItem('ddingpack-welcome-seen', '1');
    const url = new URL(location.href);
    url.searchParams.delete('welcome');
    history.replaceState({}, '', url.toString());
  };
  document.querySelector('[data-welcome-enter]')?.addEventListener('click', closeWelcome);
  document.querySelectorAll('[data-welcome-reopen]').forEach((btn) => btn.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('ddingpack-welcome-seen');
    if (currentPath === 'index.html') openWelcome();
    else location.href = 'index.html?welcome=1';
  }));
  if (overlay) {
    const seen = localStorage.getItem('ddingpack-welcome-seen') === '1';
    if (shouldForceWelcome || !seen) openWelcome();
    else overlay.classList.add('is-hidden');
  }

  const toast = document.querySelector('[data-toast]');
  if (toast && localStorage.getItem('ddingpack-toast-dismissed') === '1') toast.remove();
  document.querySelector('[data-toast-close]')?.addEventListener('click', () => {
    localStorage.setItem('ddingpack-toast-dismissed', '1');
    toast?.remove();
  });

  (function initChannelTalk() {
    const w = window;
    if (w.ChannelIO) return;
    const ch = function () { ch.c(arguments); };
    ch.q = [];
    ch.c = function (args) { ch.q.push(args); };
    w.ChannelIO = ch;
    function loadScript() {
      if (w.ChannelIOInitialized) return;
      w.ChannelIOInitialized = true;
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
      const x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    }
    if (document.readyState === 'complete') loadScript();
    else {
      w.addEventListener('DOMContentLoaded', loadScript);
      w.addEventListener('load', loadScript);
    }
    w.ChannelIO('boot', { pluginKey: '5a172fdc-10ee-45ca-b437-b1c63541c969', language: 'ko' });
  })();
})();

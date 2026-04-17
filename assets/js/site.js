
(() => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('ddingpack-theme') || 'dark';
  const applyTheme = (theme) => {
    const isDark = theme !== 'light';
    root.classList.toggle('dark', isDark);
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('ddingpack-theme', isDark ? 'dark' : 'light');
    document.querySelectorAll('[data-theme-icon]').forEach(el => el.textContent = isDark ? 'dark_mode' : 'light_mode');
    document.querySelectorAll('[data-theme-label]').forEach(el => el.textContent = isDark ? '다크 모드' : '라이트 모드');
    document.querySelectorAll('[data-theme-toggle]').forEach(el => el.setAttribute('aria-label', isDark ? '다크 모드' : '라이트 모드'));
    document.querySelectorAll('.theme-toggle[data-theme-value]').forEach(btn => {
      const active = btn.getAttribute('data-theme-value') === (isDark ? 'dark' : 'light');
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('is-active', active);
    });
  };
  applyTheme(savedTheme);
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', () => applyTheme(root.classList.contains('dark') ? 'light' : 'dark')));
  document.querySelectorAll('.theme-toggle[data-theme-value]').forEach(btn => btn.addEventListener('click', () => applyTheme(btn.getAttribute('data-theme-value'))));

  const drawer = document.querySelector('[data-mobile-drawer]');
  const openDrawer = () => drawer?.classList.add('show');
  const closeDrawer = () => drawer?.classList.remove('show');
  document.querySelectorAll('[data-mobile-menu]').forEach(btn => btn.addEventListener('click', openDrawer));
  document.querySelectorAll('[data-mobile-close]').forEach(btn => btn.addEventListener('click', closeDrawer));

  const welcome = document.querySelector('.welcome-overlay');
  const openWelcome = () => welcome?.classList.add('show');
  const closeWelcome = () => welcome?.classList.remove('show');
  if (welcome) {
    const seen = localStorage.getItem('ddingpack-welcome-seen') === '1';
    if (!seen || location.hash === '#welcome') openWelcome();
    document.querySelectorAll('[data-welcome-enter]').forEach(btn => btn.addEventListener('click', () => {
      localStorage.setItem('ddingpack-welcome-seen', '1');
      closeWelcome();
      if (location.hash === '#welcome') history.replaceState(null, '', location.pathname + location.search);
    }));
    welcome.addEventListener('click', (e) => { if (e.target === welcome) closeWelcome(); });
  }
  document.querySelectorAll('[data-reopen-welcome]').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('ddingpack-welcome-seen');
    if (welcome) openWelcome(); else window.location.href = 'index.html#welcome';
  }));

  document.querySelectorAll('.toast-close').forEach(btn => btn.addEventListener('click', ()=> btn.closest('.toast-area')?.remove()));

  document.querySelectorAll('[data-preview-image]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-preview-image');
      const alt = trigger.getAttribute('data-preview-alt') || '이미지 확대 보기';
      let modal = document.querySelector('.image-preview-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.className = 'image-preview-modal';
        modal.innerHTML = `<div class="image-preview-dialog"><div class="image-preview-head"><div><div class="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">Preview</div><div class="font-headline text-2xl font-bold">적용 예시 확대 보기</div></div><button class="image-preview-close" type="button" aria-label="이미지 닫기"><span class="material-symbols-outlined">close</span></button></div><img alt="" /></div>`;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.image-preview-close')) modal.classList.remove('show'); });
      }
      const img = modal.querySelector('img');
      img.src = src; img.alt = alt;
      modal.classList.add('show');
    });
  });

  (function initChannelTalk(){
    var w=window; if(w.ChannelIO) return;
    var ch=function(){ ch.c(arguments); }; ch.q=[]; ch.c=function(args){ ch.q.push(args); }; w.ChannelIO=ch;
    function l(){ if(w.ChannelIOInitialized) return; w.ChannelIOInitialized=true; var s=document.createElement('script'); s.type='text/javascript'; s.async=true; s.src='https://cdn.channel.io/plugin/ch-plugin-web.js'; var x=document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s,x); }
    if(document.readyState==='complete') l(); else w.addEventListener('DOMContentLoaded', l);
    w.ChannelIO('boot',{pluginKey:'5a172fdc-10ee-45ca-b437-b1c63541c969', language:'ko'});
  })();
})();

/* Lab chrome (variant-lab / design-lab skills). Pairs with lab-chrome.css.
   LabChrome.mount({ title, items }) builds a lab dock (optional: a page with a variant-lab Options panel needs no dock).
   items: [{ label, href }] for links, [{ label, pressed: () => bool, onClick }] for buttons, 'sep' for a divider.
   Press L (outside text fields) to hide every [data-lab] element; a small LAB tab stays as the way back. ?lab=0 hides them
   and the tab too (the clean view for screenshots). The choice lasts for the tab; ?lab=1 or L shows the lab again. */
(() => {
  const root = document.documentElement;
  const KEY = 'lab-off';
  const read = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } };
  const write = v => { try { sessionStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {} };
  const q = new URLSearchParams(location.search).get('lab');
  if (q === '0') write(true); if (q === '1') write(false);
  root.classList.toggle('lab-off', read());

  // When lab UI is hidden with L, a small LAB tab stays so it can come back without the keyboard (built on load, dock or not).
  // ?lab=0 is the clean view for screenshots: nothing lab-only is drawn, not even that tab (L or ?lab=1 brings the lab back).
  const clean = q === '0';
  let peek;
  function setOff(v) {
    root.classList.toggle('lab-off', v); write(v);
    if (peek) peek.hidden = !v || clean;
    try { dispatchEvent(new Event('lab:layout')); } catch (e) {}   // a docked variant-lab panel gives its room back; stages re-fit
  }
  function makePeek() {
    if (peek) return;
    peek = document.createElement('button');
    peek.type = 'button'; peek.className = 'lab-dock'; peek.hidden = !read() || clean; peek.style.cssText = 'padding:4px';
    peek.innerHTML = '<span class="lab-tag">LAB</span>'; peek.setAttribute('aria-label', 'Show lab UI');
    peek.addEventListener('click', () => setOff(false));
    document.body.appendChild(peek);                       // not data-lab: it is the way back
  }
  if (document.body) makePeek(); else addEventListener('DOMContentLoaded', makePeek);

  function mount({ title = 'Lab', items = [] } = {}) {
    const dock = document.createElement('div');
    dock.className = 'lab-dock'; dock.setAttribute('data-lab', ''); dock.setAttribute('role', 'toolbar'); dock.setAttribute('aria-label', 'Design lab controls (not part of the site)');
    dock.innerHTML = `<span class="lab-tag" title="Lab only, never ships">LAB</span><span class="lab-hide-sm">${title}</span><span class="lab-sep"></span>`;
    const refresh = [];
    items.forEach(it => {
      if (it === 'sep') { dock.insertAdjacentHTML('beforeend', '<span class="lab-sep"></span>'); return; }
      const el = document.createElement(it.href ? 'a' : 'button');
      el.textContent = it.label;
      if (it.href) { el.href = it.href; if (it.newTab) el.target = '_blank'; }
      else { el.type = 'button'; el.addEventListener('click', () => { it.onClick && it.onClick(); refresh.forEach(f => f()); }); }
      if (it.pressed) refresh.push(() => el.setAttribute('aria-pressed', String(!!it.pressed())));
      dock.appendChild(el);
    });
    const hide = document.createElement('button'); hide.type = 'button'; hide.innerHTML = 'Hide lab UI <kbd>L</kbd>';
    hide.addEventListener('click', () => setOff(true));
    dock.append(hide);
    document.body.appendChild(dock);

    makePeek();
    refresh.forEach(f => f());
    return { refresh: () => refresh.forEach(f => f()) };
  }

  addEventListener('keydown', e => {
    if (e.key !== 'l' && e.key !== 'L') return;
    if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable) return;
    setOff(!root.classList.contains('lab-off'));
  });

  window.LabChrome = { mount, setOff };
})();

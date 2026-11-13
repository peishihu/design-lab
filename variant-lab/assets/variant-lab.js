/* variant-lab panel (from the variant-lab skill, v1.3.0). A round blue gear button (bottom right) opens a scrollable panel that switches a page between options.
   The panel follows the Figma UI3 properties panel (see variant-lab/references/figma-ui3-components.md): collapsible sections with
   full-width dividers, 24 px controls, system font 11 px, dropdowns for single choices, a one-column checkbox list for multiple choices.
   VariantLab.mount({
     id,                                                         // stable lab id, the same on every computer (Load saved checks it)
     title,
     about:     { question, round, revision, status, focus, history: [{ round, date, tried, decided, file }] },
                // the About drawer (info icon in the header). revision: whole number, raised on every control or preset change in a round and
                // reset to 0 when round goes up. status: 'Active' | 'Chosen' | 'Parked' | 'Rejected'. history oldest first; file = the saved file it came from
     options:   { key: [label, { value: itemLabel, ... }] },     // choose one: a dropdown that applies at once. First value = today
     checks:    { key: [label, { value: label, ... }] },         // choose any number: a one-column checkbox list. Stored as "a,b" in declaration order ('' = none)
     switches:  { key: 'Label' },                                // one on/off setting that applies at once. Values 'on' / 'off' (default 'off')
     ranges:    { key: { label, min, max, step, unit } },        // a number field plus a slider on one line; the field is exact, the slider is quick
     order:     ['key', ...],                                    // optional panel order; default: options, checks, switches, ranges
     groups:    { gid: [label, ['key', ...]] },                  // optional: one collapsible section holds several controls (since 1.3).
                                                                 // Use it for a type role (H1, H2, Body…): font, weight, style, size, tracking, line height together.
                                                                 // The group sits where its first member is in the order. Layout only: not in the saved state or configHash.
     recommend: { key: ['value', ...] },                         // the AI's recommendation: a four-point star after the label
     picked:    { key: 'value' },                                // the reviewer's choice from the last round: not drawn, only kept out of the archive
     fresh:     { key: ['value', ...] },                         // new this round: a small blue dot after the label (the star wins when both apply)
     archive:   { key: ['value', ...] },                         // not picked last round: an Archive group at the end of the dropdown (options)
                                                                 // or the collapsed Archive section (checks)
     archivePresets: ['name', ...],                              // presets moved to the Archive group of the preset list
     notes:     { key: 'one line on why this is open' },         // the row name's tooltip; CONFIRM adds a small "?" marker
     presets:   { name: fullState, ... },                        // optional; first preset = baseline and Reset target. Name it by what it changes
     presetInfo:{ name: { note, by: 'ai' | 'you', preferred, recommended, round } },     // one-line description and markers per preset
     feedback,                                                   // explicit review text only
     render(state),
     open: false, theme: 'light',                                // start open / in night mode ('dark')
     compareKey: 'b',                                            // hold this key to see the baseline; null turns the key off (the Hold button stays)
   })
   State lives in location.hash. Esc closes the open dropdown first, then the About drawer, then the Note, then the panel.
   Hold B (or the Hold button) renders the baseline while held; the selection itself does not change.
   The panel always floats over the page and never changes its size or aspect ratio (dock is ignored since 1.1.1).
   The Note is a collapsible section; what is written there goes into Save selection as reviewerNote and comes back with Load saved.
   VariantLab.viewport() is the window size; 'lab:layout' fires when the panel opens or closes. */
(() => {
  const THEME_KEY = 'lab-theme', NOTE_KEY = 'lab-note:', ABOUT_KEY = 'lab-about:', SEC_KEY = 'lab-sec:';
  const STATUSES = ['Active', 'Chosen', 'Parked', 'Rejected'];
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const root = typeof document !== 'undefined' ? document.documentElement : null;
  const layoutChanged = () => { try { dispatchEvent(new Event('lab:layout')); } catch (e) {} };
  // 16 px line icons (currentColor), so the header carries no words to translate.
  const svg = (d, s = 16, vb = 20) => `<svg viewBox="0 0 ${vb} ${vb}" width="${s}" height="${s}" aria-hidden="true" focusable="false">${d}</svg>`;
  const ICON = {
    moon: svg('<path d="M15.6 12.4A6.4 6.4 0 0 1 7.6 4.4a6.4 6.4 0 1 0 8 8z"/>'),
    sun: svg('<circle cx="10" cy="10" r="3.4"/><path d="M10 2v2.2M10 15.8V18M2 10h2.2M15.8 10H18M4.3 4.3l1.6 1.6M14.1 14.1l1.6 1.6M4.3 15.7l1.6-1.6M14.1 5.9l1.6-1.6"/>'),
    info: svg('<circle cx="10" cy="10" r="7.5"/><path d="M10 9v5.2M10 6v.2"/>'),
    close: svg('<path d="M5 5l10 10M15 5 5 15"/>'),
    chev: svg('<path d="M5.5 7l2.5 2.5L10.5 7"/>', 16, 16),      // dropdown chevron
    sec: svg('<path d="M5.5 7l2.5 2.5L10.5 7"/>', 16, 16),       // section chevron: rotated when collapsed
    tick: svg('<path d="M4.5 8.2l2.3 2.3 4.7-4.9"/>', 16, 16),   // the selected item in a menu
    check: svg('<path d="M3.5 8.5l3 3 6-7"/>', 10, 16),          // inside a checked checkbox
  };
  // The floating button's gear: 8 teeth around a hole, drawn here so no icon set (or its licence) is needed.
  ICON.gear = svg(`<path d="${(() => {
    const n = 8, ro = 8, ri = 6, h = Math.PI / n, pt = (r, a) => `${(10 + r * Math.cos(a)).toFixed(2)} ${(10 + r * Math.sin(a)).toFixed(2)}`;
    let d = '';
    for (let i = 0; i < n; i++) { const a = i * 2 * h; d += `${i ? 'L' : 'M'}${pt(ri, a - h * .62)}L${pt(ro, a - h * .36)}L${pt(ro, a + h * .36)}L${pt(ri, a + h * .62)}`; }
    return d + 'Z';
  })()}"/><circle cx="10" cy="10" r="2.6"/>`, 20);
  // marks: icons only, the words are in the tooltip. A four-point star = AI pick; a small dot = new this round.
  const STAR = '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false"><path d="M8 1.5Q9.17 6.83 14.5 8Q9.17 9.17 8 14.5Q6.83 9.17 1.5 8Q6.83 6.83 8 1.5Z"/></svg>';
  function viewport() { return { width: Math.max(320, innerWidth), height: innerHeight }; }
  function mount({ id, title = 'Variant lab', about = null, feedback = '', options, checks = {}, switches = {}, ranges = {}, order = [], groups: ctlGroups = {}, recommend = {}, picked = {}, fresh = {}, archive = {}, archivePresets = [], notes = {}, presets, presetInfo = {}, render, open = false, dock = false, theme = 'light', compareKey = 'b' }) {
    const warn = m => { try { console.warn('VariantLab: ' + m); } catch (e) {} };
    // The lab id must be the same on every computer, or a colleague's saved file is rejected. Never derive it from the file path.
    if (!id) { id = String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'variant-lab'; warn(`no id given, using "${id}". Pass a stable id to mount().`); }
    // Labels, notes and names go into HTML: escape them so a quote or < in copy can't break the panel.
    const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
    if (typeof render !== 'function') { warn('render(state) is missing; the panel will not change the page.'); render = () => {}; }
    if (!about || typeof about !== 'object') about = null;
    ranges = ranges || {}; checks = checks || {}; switches = switches || {}; presetInfo = presetInfo || {};
    let cmpKey = null;
    if (compareKey != null) { if (typeof compareKey === 'string' && compareKey.length === 1) cmpKey = compareKey.toLowerCase(); else warn('compareKey must be one character or null; the hold-to-compare key is off.'); }
    const cmpLabel = cmpKey ? cmpKey.toUpperCase() : '';

    // ---- the About record: round, revision (shown as r<round>.<revision>) and status ----
    const roundNo = about && about.round != null ? about.round : null;
    let revision = 0, status = 'Active';
    if (about && about.revision != null) { if (Number.isInteger(about.revision) && about.revision >= 0) revision = about.revision; else warn('about.revision must be a whole number from 0; using 0.'); }
    if (about && about.status != null) { if (STATUSES.includes(about.status)) status = about.status; else warn(`about.status must be one of ${STATUSES.join(', ')}; using Active.`); }
    const version = roundNo != null ? `r${roundNo}.${revision}` : null;

    // ---- controls: one table, four kinds ----
    const kind = {}, opts = {};
    const addKind = (k, type, def) => { if (own(kind, k)) { warn(`"${k}" is declared twice; the ${type} version is skipped.`); return; } kind[k] = type; opts[k] = def; };
    Object.entries(options || {}).forEach(([k, d]) => (Array.isArray(d) && d[1] && typeof d[1] === 'object' && Object.keys(d[1]).length ? addKind(k, 'choice', d) : warn(`options.${k} must be [label, { value: itemLabel }]; skipped.`)));
    Object.entries(checks).forEach(([k, d]) => (Array.isArray(d) && d[1] && typeof d[1] === 'object' && Object.keys(d[1]).length ? addKind(k, 'check', d) : warn(`checks.${k} must be [label, { value: label }]; skipped.`)));
    Object.entries(switches).forEach(([k, d]) => addKind(k, 'switch', [typeof d === 'object' && d ? d.label ?? k : d ?? k, { off: 'Off', on: 'On' }]));
    Object.entries(ranges).forEach(([k, r]) => (r && isFinite(r.min) && isFinite(r.max) && +r.min < +r.max ? addKind(k, 'range', [r.label ?? k, {}]) : warn(`ranges.${k} needs numeric min < max; skipped.`)));
    const declared = Object.keys(kind);
    const keys = [...(Array.isArray(order) ? order : []).filter(k => own(kind, k)), ...declared.filter(k => !(order || []).includes(k))];
    const vals = k => Object.keys(opts[k][1]);
    // ---- groups: several controls in one section (layout only) ----
    const groupOf = {}, groupDefs = [];
    Object.entries(ctlGroups && typeof ctlGroups === 'object' ? ctlGroups : {}).forEach(([gid, g]) => {
      if (!Array.isArray(g) || !Array.isArray(g[1])) { warn(`groups.${gid} must be [label, ['key', ...]]; skipped.`); return; }
      const members = g[1].filter(k => { if (!own(kind, k)) { warn(`groups.${gid}: "${k}" is not a control; skipped.`); return false; } if (own(groupOf, k)) { warn(`groups.${gid}: "${k}" is already in group ${groupOf[k]}; skipped.`); return false; } return true; });
      if (!members.length) return;
      members.forEach(k => { groupOf[k] = gid; });
      groupDefs.push({ gid, label: g[0] ?? gid, members: keys.filter(k => members.includes(k)) });
    });
    // Values are compared as strings (sliders and the URL give strings), so presets written with numbers (gap: 40) still match.
    const canon = (k, v) => {
      if (v == null) return v;
      if (kind[k] === 'check') { const parts = Array.isArray(v) ? v.map(String) : typeof v === 'string' ? (v ? v.split(',') : []) : null; return parts ? vals(k).filter(x => parts.includes(x)).join(',') + (parts.some(p => !vals(k).includes(p)) ? ',?' : '') : v; }
      return typeof v === 'object' ? v : String(v);
    };
    const valid = (k, v) => {
      if (v == null || typeof v === 'object' || !own(kind, k)) return false;
      v = String(v);
      if (kind[k] === 'range') return v.trim() !== '' && isFinite(+v) && +v >= +ranges[k].min && +v <= +ranges[k].max;
      if (kind[k] === 'check') { if (v === '') return true; const p = v.split(','); return p.every(x => vals(k).includes(x)) && new Set(p).size === p.length; }
      return own(opts[k][1], v);
    };
    const fallback = k => (kind[k] === 'range' ? String(ranges[k].value ?? ranges[k].min) : kind[k] === 'check' ? '' : kind[k] === 'switch' ? 'off' : vals(k)[0]);

    // ---- presets: first = baseline. Typos are reported and ignored instead of silently matching nothing ----
    if (!presets || typeof presets !== 'object' || !Object.keys(presets).length) presets = { Today: {} };   // no presets: one "Today" = first option of every control
    presets = Object.fromEntries(Object.entries(presets).map(([n, p]) => [n, { ...(p || {}) }]));
    const names = Object.keys(presets);
    names.forEach(n => Object.entries(presets[n]).forEach(([k, v]) => {
      if (!own(kind, k)) { warn(`preset "${n}" sets unknown control "${k}"; ignored.`); delete presets[n][k]; return; }
      const c = canon(k, v);
      if (!valid(k, c)) { warn(`preset "${n}" has an invalid value for "${k}" (${v}); ignored.`); delete presets[n][k]; } else presets[n][k] = c;
    }));
    Object.keys(presetInfo).forEach(n => { if (!own(presets, n)) warn(`presetInfo "${n}" has no matching preset.`); });
    picked = Object.fromEntries(Object.entries(picked || {}).map(([k, v]) => [k, canon(k, v)]));
    const first = Object.fromEntries(keys.map(k => [k, presets[names[0]][k] ?? fallback(k)]));
    const full = n => ({ ...first, ...presets[n] });   // presets from older rounds may lack newer keys
    const read = () => { const q = new URLSearchParams(location.hash.slice(1)), s = {}; keys.forEach(k => { const v = canon(k, q.get(k)); s[k] = valid(k, v) ? v : first[k]; }); return s; };
    const same = (a, b) => keys.every(k => a[k] === b[k]);
    const currentPreset = s => names.find(n => same(full(n), s)) ?? null;
    const changedKeys = s => keys.filter(k => s[k] !== first[k]);
    // The nearest preset: the one with the fewest differing controls; a tie goes to the one declared first.
    const diffKeys = (preset, s) => keys.filter(k => preset[k] !== s[k]);
    const nearestOf = s => names.reduce((best, n) => (best === null || diffKeys(full(n), s).length < diffKeys(full(best), s).length ? n : best), null);

    // configHash: 8 hex characters over the config's controls, option values, ranges and presets. Labels, notes and layout order are not part of it.
    const fnv = str => { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return (h >>> 0).toString(16).padStart(8, '0'); };
    const hashKeys = [...keys].sort();
    const configHash = fnv(JSON.stringify([
      hashKeys.map(k => [k, kind[k], kind[k] === 'range' ? [ranges[k].min, ranges[k].max, ranges[k].step ?? 1] : kind[k] === 'switch' ? ['off', 'on'] : Object.keys(opts[k][1])]),
      names.map(n => [n, hashKeys.map(k => full(n)[k])]),
    ]));

    // ---- marks: two icons only, at most one per item, the star first. Words live in the tooltip. ----
    const star = (k, v) => (recommend[k] || []).includes(v);
    const isNew = (k, v) => (fresh[k] || []).includes(v), arch = (k, v) => (archive[k] || []).includes(v) && picked[k] !== v;
    const marks = (rec, nw) => (rec ? `<i class="ai" role="img" title="AI pick: the option the AI recommends" aria-label="AI pick">${STAR}</i>` : nw ? '<i class="new" role="img" title="New this round" aria-label="New this round"></i>' : '');
    const label = (k, v, l) => `<span>${esc(l)}</span>${marks(star(k, v), isNew(k, v))}`;
    // notes are not drawn as text. A note becomes the row name's tooltip and goes into the saved file; a note with CONFIRM also gets a small "?" marker.
    const restoreIcon = svg('<path d="M6 4 2.5 7.5 6 11M3 7.5h6a5 5 0 1 1-4.4 7.4"/>');
    const restoreButton = k => `<button type="button" class="restore-one" data-reset-key="${esc(k)}" title="Restore ${esc(opts[k][0])} to baseline (${esc(first[k])})" aria-label="Restore ${esc(opts[k][0])} to baseline (${esc(first[k])})" hidden disabled>${restoreIcon}</button>`;
    let uid = 0;
    const rowName = (k, attrs = '') => `<span${attrs}${notes[k] ? ` title="${esc(notes[k])}"` : ''}>${esc(opts[k][0])}</span>${notes[k] && /\bCONFIRM\b/.test(notes[k]) ? `<i class="cfm" role="img" title="${esc(notes[k])}" aria-label="${esc(notes[k])}">?</i>` : ''}`;
    const chk = (k, v, l) => `<label class="chk" title="${esc(l)}"><input type="checkbox" data-c="${esc(k)}" value="${esc(v)}"><span class="box" aria-hidden="true">${ICON.check}</span>${label(k, v, l)}</label>`;
    const unit = k => esc(ranges[k].unit || '');

    // ---- dropdowns: one component for the preset and for every single choice. Closed = the current value (+ its mark);
    // open = a menu under it, the selected item with a tick, optional groups split by a line. ----
    const ddItem = (k, v, l) => `<button type="button" class="pd-item" data-k="${esc(k)}" data-v="${esc(v)}" title="${esc(l)}"><span class="pd-tk">${ICON.tick}</span><span class="pd-name">${label(k, v, l)}</span></button>`;
    const ddGroups = gs => gs.filter(([, items]) => items.length).map(([g, items]) => `<div class="pd-grp" role="group"${g ? ` aria-label="${esc(g)}"` : ''}>${g ? `<p class="pd-g">${esc(g)}</p>` : ''}${items.join('')}</div>`).join('');
    const dd = (cur, listId, curId, nameId, body) => `<div class="pd"><button type="button" class="pd-btn" aria-haspopup="true" aria-expanded="false" aria-controls="${listId}" aria-labelledby="${nameId} ${curId}"><span class="pd-cur" id="${curId}" data-cur="${esc(cur)}"></span><span class="pd-chev">${ICON.chev}</span></button><div class="pd-list" id="${listId}" hidden>${body}</div></div>`;

    // ---- the preset list: baseline first, then preferred, then explorations and recommendations, then archive ----
    const pinfo = n => (presetInfo[n] && typeof presetInfo[n] === 'object' ? presetInfo[n] : {});
    const activeNames = names.filter(n => !archivePresets.includes(n));
    const groups = [
      ['Baseline', [names[0]]],
      ['Preferred', activeNames.filter(n => n !== names[0] && pinfo(n).preferred)],
      ['Explorations', activeNames.filter(n => n !== names[0] && !pinfo(n).preferred)],
      ['Archive', archivePresets.filter(n => own(presets, n) && n !== names[0])],
    ].filter(([, list]) => list.length);
    // A preset gets the star when recommended, else the dot when it was added this round (not the baseline).
    const presetNew = n => n !== names[0] && roundNo != null && pinfo(n).round != null && String(pinfo(n).round) === String(roundNo);
    const presetMarks = n => marks(!!pinfo(n).recommended, presetNew(n));
    const presetItem = n => `<button type="button" class="pd-item" data-preset="${esc(n)}" title="${esc(pinfo(n).note ? n + ': ' + pinfo(n).note : n)}"><span class="pd-tk">${ICON.tick}</span><span class="pd-name"><span>${esc(n)}</span>${presetMarks(n)}</span>${pinfo(n).note ? `<span class="pd-desc">${esc(pinfo(n).note)}</span>` : ''}</button>`;

    // ---- the About drawer: what the lab asks, this round, and what earlier rounds tried and decided ----
    const hist = about && Array.isArray(about.history) ? [...about.history].filter(h => h && typeof h === 'object').reverse() : [];
    const infoTitle = ['About this lab', roundNo != null ? `Round ${roundNo}` : null, version, status].filter(Boolean).join(' · ');
    const aboutLine = [roundNo != null ? `Round ${roundNo}` : null, version, status].filter(Boolean).join(' · ');
    const aboutHTML = about ? `<div class="about" id="lab-about" hidden>
      <p class="about-st${status === 'Active' ? '' : ' off'}">${status === 'Active' ? '' : '<i class="dot" aria-hidden="true"></i>'}${esc(aboutLine)}</p>
      ${about.question ? `<p class="info-k">Question</p><p class="info-v">${esc(about.question)}</p>` : ''}
      ${about.focus ? `<p class="info-k">This round${roundNo != null ? ` (${esc(roundNo)})` : ''}</p><p class="info-v">${esc(about.focus)}</p>` : ''}
      ${hist.length ? `<p class="info-k">Earlier rounds</p><ol class="hist">${hist.map(h => `<li><b>${h.round != null ? 'R' + esc(h.round) : ''}${h.date ? ' · ' + esc(h.date) : ''}</b>${h.file ? `<span class="file">${esc(h.file)}</span>` : ''}${h.tried ? `<span>Tried: ${esc(h.tried)}</span>` : ''}${h.decided ? `<span>Decided: ${esc(h.decided)}</span>` : ''}</li>`).join('')}</ol>` : ''}
    </div>` : '';

    // ---- sections: a 40 px header (chevron + name, extras on the right) over the content; a full-width line between sections.
    // Open/closed is remembered per lab. Controls start open; Archive and Note start closed. ----
    const secDefault = sid => !(sid === ':archive' || sid === ':note');
    let secState = {};
    try { secState = JSON.parse(store.get(SEC_KEY + id) || '{}') || {}; } catch (e) { secState = {}; }
    const secOpen0 = sid => (own(secState, sid) ? !!secState[sid] : secDefault(sid));
    let inGrp = false;   // true while drawing the controls inside a group: they stay open and lose their own chevron
    const sec = (sid, nameHTML, right, body, extra = '') => {
      const n = ++uid, on = inGrp || secOpen0(sid);
      return `<div class="sec${on ? '' : ' shut'}${inGrp ? ' in-grp' : ''}" data-sec="${esc(sid)}"${extra}><div class="lbl"><button type="button" class="tog" aria-expanded="${on}" aria-controls="lab-sc-${n}"><span class="sec-chev">${ICON.sec}</span>${nameHTML}</button>${right || ''}</div><div class="sc" id="lab-sc-${n}"${on ? '' : ' hidden'}>${body}</div></div>`;
    };
    const section = k => {
      const lab = esc(opts[k][0]), n = ++uid;
      if (kind[k] === 'range') {
        const r = ranges[k];
        // number field and slider on one line; min and max sit at the two ends of the bar
        return sec(k, rowName(k) + marks(false, isNew(k, 'range')), restoreButton(k), `<div class="r2"><span class="num-wrap"><input class="num" type="number" inputmode="decimal" data-n="${esc(k)}" min="${esc(r.min)}" max="${esc(r.max)}" step="${esc(r.step ?? 1)}" aria-label="${lab}${r.unit ? ' in ' + unit(k) : ''}, ${esc(r.min)} to ${esc(r.max)}"><span class="unit">${unit(k)}</span></span>
          <div class="rwrap"><span class="end" aria-hidden="true">${esc(r.min)}</span><input class="rng" type="range" data-r="${esc(k)}" min="${esc(r.min)}" max="${esc(r.max)}" step="${esc(r.step ?? 1)}" aria-label="${lab}"><span class="end" aria-hidden="true">${esc(r.max)}</span></div></div>
          <p class="err" data-err="${esc(k)}" role="alert" hidden></p>`);
      }
      // a switch is one line: name, then the toggle on the right; nothing to collapse
      if (kind[k] === 'switch') return `<div class="sec flat${inGrp ? ' in-grp' : ''}" data-sec="${esc(k)}"><div class="lbl sw-row"><span class="sec-sp" aria-hidden="true"></span>${rowName(k, ` id="lab-sw-${esc(k)}"`)}${marks(star(k, 'on'), isNew(k, 'on'))}${restoreButton(k)}<button type="button" class="switch" role="switch" data-s="${esc(k)}" aria-checked="false" aria-labelledby="lab-sw-${esc(k)}"><span class="track" aria-hidden="true"></span></button></div></div>`;
      if (kind[k] === 'check') return sec(k, rowName(k), restoreButton(k), `<div class="chks" role="group" aria-label="${lab}">${Object.entries(opts[k][1]).map(([v, l]) => (arch(k, v) ? '' : chk(k, v, l))).join('')}</div>`);
      // choose one: a dropdown. Archived values sit in an Archive group at the end of the menu.
      const entries = Object.entries(opts[k][1]);
      // A long menu (more than 12 values, e.g. every installed font) gets a search field at the top (since 1.3).
      const search = entries.length > 12 ? `<input class="pd-q" type="search" data-q placeholder="Search ${entries.length}" aria-label="Search ${lab}" autocomplete="off" spellcheck="false">` : '';
      const body = search + ddGroups([['', entries.filter(([v]) => !arch(k, v)).map(([v, l]) => ddItem(k, v, l))], ['Archive', entries.filter(([v]) => arch(k, v)).map(([v, l]) => ddItem(k, v, l))]]);
      return sec(k, rowName(k, ` id="lab-nm-${n}"`), restoreButton(k), dd(k, `lab-dd-${n}`, `lab-dd-cur-${n}`, `lab-nm-${n}`, body));
    };
    const archivedChecks = keys.filter(k => kind[k] === 'check').map(k => [k, Object.entries(opts[k][1]).filter(([v]) => arch(k, v))]).filter(([, a]) => a.length);

    let S = read();
    let noteText = store.get(NOTE_KEY + id) || '';
    let noteRevision = 0, noteSerial = 0;
    let loadedFrom = null, loadNote = '';   // the file the last successful load came from, and the status line it produced

    // Session-local selection history. Text fields retain native undo. A continuous range gesture is one action.
    const undoStack = [];
    let activeRange = null, rangeKey = null;
    function finishRange() {
      if (activeRange && undoStack.length && !undoStack[undoStack.length - 1].restoreNote && same(undoStack[undoStack.length - 1].state, S)) undoStack.pop();
      activeRange = null;
      while (undoStack.length > 100) undoStack.shift();
    }
    function remember(next, { range = null, restoreNote = false, noteAfter = noteText, force = false } = {}) {
      if (!force && same(next, S)) return false;
      if (range == null) finishRange();
      if (range == null || activeRange !== range) {
        undoStack.push({ state: { ...S }, loadedFrom, loadNote, restoreNote, noteBefore: noteText, noteBeforeRevision: noteRevision, noteAfterRevision: restoreNote && noteAfter !== noteText ? noteSerial + 1 : noteRevision });
        if (range == null && undoStack.length > 100) undoStack.shift();
      }
      activeRange = range;
      return true;
    }
    function undo() {
      finishRange();
      const previous = undoStack.pop();
      if (!previous) return false;
      S = { ...previous.state }; loadedFrom = previous.loadedFrom; loadNote = previous.loadNote;
      if (previous.restoreNote && noteRevision === previous.noteAfterRevision) { setNote(previous.noteBefore); noteRevision = previous.noteBeforeRevision; }
      holdKey = false; holdPtr = false; syncCompare();
      apply();
      const status = panel.querySelector('[data-export-status]');
      if (status) status.textContent = 'Undid the last selection change.';
      return true;
    }
    function resetControl(key) {
      if (!own(kind, key) || S[key] === first[key]) return false;
      const next = { ...S, [key]: first[key] }; remember(next); S = next; apply(); return true;
    }

    // ---- save / load: declared review choices and the reviewer's own note only, never DOM, storage or application objects ----
    const slug = (v, n = 40) => String(v ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, n).replace(/-$/, '');
    // File name: lab, version, nearest preset and (for a custom mix) up to three changed controls, then the date.
    // promo-card_r4.2_glow-focus-fast+titles-extras_2026-11-08.json   or   promo-card_r4.2_glow-focus-fast_2026-11-08.json
    // Dates people read (file name, load message) use the local calendar day; exportedAt stays a full UTC timestamp.
    const localDay = d => { const p = x => String(x).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; };
    function fileName() {
      const near = nearestOf(S), dk = diffKeys(full(near), S);
      const what = (slug(near) || 'preset') + (dk.length ? '+' + dk.slice(0, 3).map(k => slug(k, 12)).join('-') : '');
      return [slug(id) || 'variant-lab', version, what, localDay(new Date())].filter(Boolean).join('_') + '.json';
    }
    function exportJSON() {
      const scalar = value => typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));
      if (keys.some(k => !scalar(S[k]) || !valid(k, S[k]) || !scalar(first[k]) || !valid(k, first[k]))) throw new Error('Review controls contain an invalid value. Choose an allowed option and retry.');
      const state = Object.fromEntries(keys.map(k => [k, S[k]]));
      const baseline = Object.fromEntries(keys.map(k => [k, first[k]]));
      const changes = Object.fromEntries(changedKeys(state).map(k => [k, { from: baseline[k], to: state[k] }]));
      const near = nearestOf(state);
      return JSON.stringify({ schemaVersion: 1, status: 'unapproved',
        lab: { id, title, version, round: roundNo, revision: about ? revision : null, status: about ? status : null, configHash },
        fileName: fileName(), basedOn: loadedFrom,
        round: roundNo, focus: about && typeof about.focus === 'string' ? about.focus : '',   // round and focus at the top level: kept for v1.0 readers, deprecated (use lab.round / lab.version)
        state, baseline, changes,
        preset: { current: currentPreset(state), nearest: near, diffFromNearest: diffKeys(full(near), state), baseline: names[0] },
        reviewerNote: typeof noteText === 'string' ? noteText : '',
        notes: Object.fromEntries(keys.filter(k => typeof notes[k] === 'string').map(k => [k, notes[k]])),
        feedback: typeof feedback === 'string' ? feedback : '', previewUrl: '#' + new URLSearchParams(state), exportedAt: new Date().toISOString() }, null, 2);
    }
    function downloadJSON() {
      let url, link;
      const status = panel.querySelector('[data-export-status]');
      try {
        const name = fileName();
        url = URL.createObjectURL(new Blob([exportJSON()], { type: 'application/json' }));
        link = document.createElement('a'); link.href = url; link.download = name;
        document.body.append(link); link.click();
        status.textContent = `Downloaded ${name}`;
      } catch (error) { status.textContent = error.message?.startsWith('Review controls') ? error.message : 'Could not save the file. Please retry, or copy the selection from the returned controller’s exportJSON() method.'; }
      finally { link?.remove(); if (url) setTimeout(() => URL.revokeObjectURL(url), 1000); }
    }
    // Restore a saved selection. All or nothing: any bad value leaves the current selection untouched.
    function importJSON(text, sourceName) {
      let data;
      try { data = JSON.parse(text); } catch (error) { throw new Error('That file is not valid JSON.'); }
      if (!data || data.schemaVersion !== 1 || !data.state || typeof data.state !== 'object' || Array.isArray(data.state)) throw new Error('That file is not a lab selection.');
      if (data.lab?.id !== id) throw new Error(`That selection is for another lab (${String(data.lab?.id)}), not this one (${id}).`);
      const metadata = [data.lab?.version, data.fileName, data.exportedAt, data.preset?.current, data.preset?.nearest, data.reviewerNote, sourceName];
      if (metadata.some(v => v != null && typeof v !== 'string') || (data.round != null && typeof data.round !== 'string' && typeof data.round !== 'number')) throw new Error('Invalid selection metadata. Nothing was changed.');
      const unknown = Object.keys(data.state).filter(k => !keys.includes(k));
      if (unknown.length) throw new Error(`Unknown controls: ${unknown.join(', ')}. Nothing was changed.`);
      const next = { ...first };
      for (const k of Object.keys(data.state)) {
        const raw = data.state[k];
        const v = typeof raw === 'string' || typeof raw === 'number' ? canon(k, String(raw)) : null;
        if (!valid(k, v)) throw new Error(`Invalid value for ${k}. Nothing was changed.`);
        next[k] = v;
      }
      const missing = keys.filter(k => !own(data.state, k));   // controls the file did not have yet: filled from the baseline
      const importedNote = typeof data.reviewerNote === 'string' ? data.reviewerNote : noteText;
      const importName = sourceName || data.fileName || null;
      remember(next, { restoreNote: true, noteAfter: importedNote, force: importedNote !== noteText || importName !== loadedFrom });
      S = next;
      loadedFrom = importName;
      if (typeof data.reviewerNote === 'string') { setNote(data.reviewerNote); if (data.reviewerNote) setNoteOpen(true); }   // a restored note is shown
      apply();
      // status line: Loaded <file> · saved from lab r3.1 on 2026-11-03 · based on "Sticky menu" · note restored
      const savedVer = data.lab?.version ?? (data.round != null ? `r${data.round}` : null);
      const savedDay = data.exportedAt && !isNaN(Date.parse(data.exportedAt)) ? localDay(new Date(data.exportedAt)) : null;
      const basis = data.preset?.current ?? data.preset?.nearest ?? null;
      const parts = [`Loaded ${loadedFrom || 'selection'}`];
      if (savedVer) parts.push(`saved from lab ${savedVer}${savedDay ? ' on ' + savedDay : ''}`);
      if (basis) parts.push(`based on "${basis}"`);
      if (typeof data.reviewerNote === 'string' && data.reviewerNote) parts.push('note restored');
      loadNote = parts.join(' · ');
      if (data.lab?.configHash && data.lab.configHash !== configHash) loadNote += missing.length
        ? ` This lab has changed since${version ? ` (now ${version})` : ''}: ${missing.length} control${missing.length === 1 ? '' : 's'} filled from baseline: ${missing.join(', ')}.`
        : ` This lab has changed since${version ? ` (now ${version})` : ''}; every saved control still exists, so nothing was filled in.`;
      return { ...S };
    }

    // ---- DOM ----
    const fab = document.createElement('button');
    fab.type = 'button'; fab.className = 'lab-fab'; fab.setAttribute('data-lab', '');   // lab chrome: hidden with L or ?lab=0 (lab-chrome.js)
    fab.setAttribute('aria-expanded', 'false'); fab.setAttribute('aria-controls', 'lab-panel');
    fab.setAttribute('aria-label', 'Open lab options'); fab.setAttribute('title', 'Open lab options');
    fab.innerHTML = ICON.gear;   // a round blue button with a gear, no word (the tooltip and aria-label say what it does)
    // Plain divs (not aside/header/footer) so page-wide element styles don't leak into the panel.
    const panel = document.createElement('div');
    panel.className = 'lab-panel'; panel.id = 'lab-panel'; panel.setAttribute('data-lab', ''); panel.setAttribute('role', 'region'); panel.setAttribute('aria-label', title + ' controls'); panel.hidden = true;
    const infoBtn = about ? `<button class="ico info" type="button" aria-expanded="false" aria-controls="lab-about" aria-label="${esc(infoTitle)}" title="${esc(infoTitle)}">${ICON.info}</button>` : '';
    const holdHTML = `<button type="button" class="hold" data-hold aria-pressed="false" aria-label="${cmpKey ? `Hold ${cmpLabel} to compare` : 'Hold to compare'}" title="Hold ${cmpKey ? cmpLabel + ', or press and hold here,' : 'here'} to see the baseline. Let go to return to your selection.">${cmpKey ? `Hold <kbd>${cmpLabel}</kbd>` : 'Hold to compare'}</button>`;
    const presetSec = sec(':preset', '<span id="lab-pd-l">Preset</span>', holdHTML,
      dd(':preset', 'lab-pd-list', 'lab-pd-cur', 'lab-pd-l', groups.map(([g, list]) => `<div class="pd-grp" role="group" aria-label="${g}"><p class="pd-g">${g}</p>${list.map(presetItem).join('')}</div>`).join('')));
    const archiveSec = archivedChecks.length ? sec(':archive', '<span title="Options not picked last round">Archive</span>', `<span class="c">${archivedChecks.reduce((n, [, a]) => n + a.length, 0)}</span>`,
      archivedChecks.map(([k, a]) => `<p class="sub-l">${esc(opts[k][0])}</p><div class="chks" role="group" aria-label="${esc(opts[k][0])}, archived">${a.map(([v, l]) => chk(k, v, l)).join('')}</div>`).join('')) : '';
    const noteSec = sec(':note', '<span>Note</span>', '', `<textarea id="lab-note-${esc(id)}" data-note rows="3" aria-label="Your note (saved with the selection)" placeholder="Why this choice? What should change next?"></textarea>`, ' data-note-box');
    panel.innerHTML = `<div class="lab-head"><span class="ttl" title="${esc(title)}">${esc(title)}</span>${infoBtn}<button class="ico undo" type="button" data-act="undo" aria-label="Undo last selection change" title="Undo last selection change (Command+Z / Ctrl+Z)" disabled>${restoreIcon}</button><button class="ico mode" type="button"></button><button class="ico x" type="button" aria-label="Close options" title="Close (Esc)">${ICON.close}</button></div>${aboutHTML}<div class="scroll">
      <p class="cmp-bar" data-cmp hidden>Showing baseline — release ${cmpKey ? cmpLabel : 'the button'} to return</p>
      ${presetSec}
      ${keys.map(k => {
        if (!own(groupOf, k)) return section(k);
        const g = groupDefs.find(d => d.gid === groupOf[k]);
        if (g.members[0] !== k) return '';
        inGrp = true; const inner = g.members.map(section).join(''); inGrp = false;
        return sec(':g:' + g.gid, `<span>${esc(g.label)}</span>`, '', `<div class="grp">${inner}</div>`, ' data-grp');
      }).join('')}
      ${archiveSec}
      ${noteSec}
    </div><div class="lab-foot"><button type="button" class="tx" data-act="reset" title="Go back to the baseline">Reset</button><span class="sp"></span><button type="button" data-act="import" title="Open a file saved with Save selection to restore its options and note">Load saved</button><button type="button" class="strong" data-act="export" title="Download a file with these options and your note. Give it to your AI agent or a colleague.">Save selection</button><input type="file" accept="application/json,.json" data-import-file hidden></div><p class="lab-export-status" data-export-status role="status" aria-live="polite"></p>`;
    // While comparing with the panel closed, a small tag above the LAB button says the page shows the baseline.
    const cmpTag = document.createElement('p');
    cmpTag.className = 'lab-cmp-tag'; cmpTag.setAttribute('data-lab', ''); cmpTag.setAttribute('role', 'status'); cmpTag.hidden = true;
    cmpTag.textContent = `Showing baseline — release ${cmpKey ? cmpLabel : 'the button'} to return`;
    document.body.append(panel, fab, cmpTag);
    const pdBtn = panel.querySelector('.pd-btn'), noteBox = panel.querySelector('[data-note]');
    const cmpBar = panel.querySelector('[data-cmp]'), holdBtn = panel.querySelector('[data-hold]');
    const aboutEl = about ? panel.querySelector('#lab-about') : null, infoEl = about ? panel.querySelector('.ico.info') : null;

    // ---- sections open / closed ----
    const secEl = sid => [...(panel.querySelectorAll('[data-sec]') || [])].find(s => s.dataset?.sec === sid) || null;
    function setSec(sid, on, focus) {
      const s = secEl(sid); if (!s) return;
      const tog = s.querySelector('.tog'), body = s.querySelector('.sc');
      s.classList.toggle('shut', !on); if (body) body.hidden = !on; if (tog) tog.setAttribute('aria-expanded', String(on));
      secState[sid] = on ? 1 : 0; store.set(SEC_KEY + id, JSON.stringify(secState));
      if (!on && openWrap && s.contains(openWrap)) setList(null, false);
      if (on && focus) focus.focus?.();
      layoutChanged();
    }
    const secIsOpen = sid => { const s = secEl(sid); return !!s && !s.classList.contains('shut'); };
    // The Note: a collapsible section, closed by default. What is written goes into Save selection (reviewerNote).
    const noteOpen = () => secIsOpen(':note');
    function setNoteOpen(on, focus) { setSec(':note', on, focus && on ? noteBox : null); }
    function setNote(t) { t = String(t); if (t !== noteText) noteRevision = ++noteSerial; noteText = t; if (noteBox && noteBox.value !== noteText) noteBox.value = noteText; store.set(NOTE_KEY + id, noteText); }
    if (noteBox) noteBox.value = noteText;

    // ---- dropdowns: one open at a time ----
    let openWrap = null;
    // The menu stays inside the panel's scroll area: it opens below the field, or above it when there is more room there
    // (a field near the bottom of the panel), and scrolls inside itself when neither side fits it whole. The footer never covers it.
    function placeList(l, b) {
      if (!l || !b?.getBoundingClientRect) return;
      l.classList.remove('up'); l.style.maxHeight = '';
      const box = (l.closest?.('.scroll') || panel).getBoundingClientRect(), r = b.getBoundingClientRect();
      const need = Math.min(l.scrollHeight, 320), below = box.bottom - r.bottom - 8, above = r.top - box.top - 8;
      const up = below < need && above > below;
      l.classList.toggle('up', up);
      const room = Math.floor(up ? above : below);
      if (room > 0 && room < need) l.style.maxHeight = Math.max(room, 64) + 'px';
    }
    // Search inside a long menu: hide items that do not contain the text, and groups left empty.
    function filterList(l, text) {
      const q = String(text || '').trim().toLowerCase();
      l.querySelectorAll('.pd-item').forEach(i => { i.hidden = !!q && !i.textContent.toLowerCase().includes(q); });
      l.querySelectorAll('.pd-grp').forEach(g => { g.hidden = ![...g.querySelectorAll('.pd-item')].some(i => !i.hidden); });
    }
    function setList(wrap, on, focusItem) {
      if (openWrap && (openWrap !== wrap || !on)) {
        const l = openWrap.querySelector('.pd-list'), b = openWrap.querySelector('.pd-btn');
        if (l) l.hidden = true; if (b) b.setAttribute('aria-expanded', 'false'); openWrap = null;
      }
      if (!on || !wrap) return;
      const l = wrap.querySelector('.pd-list'), b = wrap.querySelector('.pd-btn');
      if (l) l.hidden = false; if (b) b.setAttribute('aria-expanded', 'true'); openWrap = wrap;
      const q = l?.querySelector('[data-q]');
      if (q) { q.value = ''; filterList(l, ''); }
      placeList(l, b);
      if (q) { q.focus(); l.querySelector('.pd-item[aria-pressed="true"]')?.scrollIntoView?.({ block: 'nearest' }); }
      else if (focusItem && l) { const items = [...l.querySelectorAll('.pd-item')]; (items.find(i => i.getAttribute('aria-pressed') === 'true') || items[0])?.focus(); }
    }
    const setPd = (on, focusItem) => setList(pdBtn ? pdBtn.closest?.('.pd') : null, on, focusItem);

    const setOpen = on => { panel.hidden = !on; fab.setAttribute('aria-expanded', String(on)); const t = on ? 'Close lab options' : 'Open lab options'; fab.setAttribute('aria-label', t); fab.setAttribute('title', t); fab.classList.toggle('on', on); if (root) root.classList.toggle('lab-panel-closed', !on); if (!on) setList(null, false); if (cmpTag) cmpTag.hidden = !comparing || on; layoutChanged(); };
    // The panel always floats over the page. dock() stays as a no-op so older labs keep running.
    const setDock = () => { if (root) root.classList.toggle('lab-docked', false); panel.classList.toggle('docked', false); };
    // Day / night lab chrome, so the panel sits well on a bright or a dark design. Only lab UI changes, never the page.
    const setTheme = t => {
      t = t === 'dark' ? 'dark' : 'light'; if (root) root.setAttribute('data-lab-theme', t);
      const b = panel.querySelector('.mode'), l = `Switch panel to ${t === 'dark' ? 'Light' : 'Dark'} mode (the page is not changed)`;
      b.innerHTML = t === 'dark' ? ICON.sun : ICON.moon; b.title = l; b.setAttribute('aria-label', l); store.set(THEME_KEY, t);
    };
    // About drawer: opened and closed by the info icon; open state is remembered per lab.
    const aboutOpen = () => !!aboutEl && !aboutEl.hidden;
    function setAbout(on) {
      if (!aboutEl) return;
      aboutEl.hidden = !on; infoEl.setAttribute('aria-expanded', String(on)); infoEl.classList.toggle('on', on);
      store.set(ABOUT_KEY + id, on ? '1' : '0'); layoutChanged();
    }
    panel.querySelector('.undo').addEventListener('click', undo);
    panel.querySelector('.mode').addEventListener('click', () => setTheme(root && root.getAttribute('data-lab-theme') === 'dark' ? 'light' : 'dark'));
    panel.querySelector('.x').addEventListener('click', () => setOpen(false));
    if (infoEl) infoEl.addEventListener('click', () => setAbout(aboutEl.hidden));
    fab.addEventListener('click', () => setOpen(panel.hidden));
    // dropdown keys: arrows on the closed button open it; in the menu arrows / Home / End move, Tab closes
    panel.addEventListener('keydown', e => {
      const t = e.target; if (!t || !t.classList) return;
      if (t.classList.contains('pd-btn')) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setList(t.closest('.pd'), true, true); } return; }
      const list = t.closest?.('.pd-list'); if (!list) return;
      const items = [...list.querySelectorAll('.pd-item')].filter(x => !x.hidden), i = items.indexOf(document.activeElement);
      if (t.matches?.('[data-q]')) {   // in the search field: Down goes into the list, Enter picks the first match
        if (e.key === 'ArrowDown') { e.preventDefault(); items[0]?.focus(); }
        else if (e.key === 'Enter') { e.preventDefault(); items[0]?.click(); }
        else if (e.key === 'Tab') setList(null, false);
        return;
      }
      const to = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1 }[e.key];
      if (to != null) { e.preventDefault(); items[Math.max(0, Math.min(items.length - 1, to))]?.focus(); }
      else if (e.key === 'Tab') setList(null, false);
    });
    addEventListener('click', e => { if (openWrap && e.target?.closest?.('.pd') !== openWrap) setList(null, false); });
    // Capture phase + stop: Esc closes the open dropdown, then the About drawer, then the Note (when typing in it), or restores a mistyped
    // number, or closes the panel; it never reaches the page (on TV labs Esc is Back).
    addEventListener('keydown', e => {
      if (e.key !== 'Escape' || panel.hidden) return;
      e.stopImmediatePropagation(); e.preventDefault();
      const t = e.target;
      if (openWrap) { const b = openWrap.querySelector('.pd-btn'); setList(null, false); b?.focus(); return; }
      if (aboutOpen()) { setAbout(false); infoEl.focus(); return; }
      if (noteOpen() && t === noteBox) { setNoteOpen(false); secEl(':note')?.querySelector('.tog')?.focus(); return; }
      if (t && t.dataset && t.dataset.n && t.value !== S[t.dataset.n]) { restoreNum(t); return; }
      setOpen(false); fab.focus();
    }, true);
    // Keys used inside the panel (arrows, Enter, Backspace, typing) must not drive the page behind it. L still toggles lab UI outside text fields.
    const keepKeys = e => { const typing = /^(input|textarea)$/i.test(e.target?.tagName || '') && !/^(checkbox|range|file)$/i.test(e.target.type || ''); if (typing || (e.key !== 'l' && e.key !== 'L')) e.stopPropagation(); };
    panel.addEventListener('keydown', keepKeys); fab.addEventListener('keydown', keepKeys);

    // ---- hold to compare: the baseline is drawn while B (or the button) is held. The selection, the hash and the panel do not change. ----
    let holdPtr = false, holdKey = false, comparing = false;
    function paint() { render(comparing ? { ...first } : { ...S }); }
    function syncCompare() {
      const on = holdPtr || holdKey;
      if (on === comparing) return;
      comparing = on;
      if (cmpBar) cmpBar.hidden = !on;
      if (cmpTag) cmpTag.hidden = !on || !panel.hidden;
      if (holdBtn) holdBtn.setAttribute('aria-pressed', String(on));
      paint();
    }
    const textFocus = t => !!t && (/^(textarea|select)$/i.test(t.tagName || '') || (/^input$/i.test(t.tagName || '') && !/^(checkbox|radio|range|file|button|submit)$/i.test(t.type || '')) || !!t.isContentEditable);
    // The compare key works whenever the lab UI is shown, with the panel open or closed. With ?lab=0 or L (the "what ships" view) it is off.
    const labShown = () => !(root && root.classList.contains('lab-off'));
    const isCmpKey = e => !!cmpKey && (e.key || '').toLowerCase() === cmpKey;
    addEventListener('keydown', e => {
      if (!isCmpKey(e) || e.repeat || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || textFocus(e.target) || !labShown()) return;
      holdKey = true; syncCompare();
    }, true);
    addEventListener('keyup', e => { if (holdKey && isCmpKey(e)) { holdKey = false; syncCompare(); } }, true);
    addEventListener('blur', () => { holdKey = false; holdPtr = false; rangeKey = null; finishRange(); syncCompare(); apply(); });
    // Press and hold on the button (mouse, pen or touch). The pointer is captured, so a small move while held does not end it,
    // and touch-action: none (CSS) keeps the browser from turning the hold into a scroll or a long-press menu.
    if (holdBtn) {
      holdBtn.addEventListener('pointerdown', e => { if (e.button > 0) return; e.preventDefault(); try { holdBtn.setPointerCapture(e.pointerId); } catch (err) {} holdPtr = true; syncCompare(); });
      const letGo = () => { if (holdPtr) { holdPtr = false; syncCompare(); } };
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => holdBtn.addEventListener(t, letGo));
      holdBtn.addEventListener('contextmenu', e => e.preventDefault());
      holdBtn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); holdPtr = true; syncCompare(); } });
      holdBtn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') letGo(); });
      holdBtn.addEventListener('blur', letGo);
    }

    // ---- number fields: the exact value. Typing shows nothing; Enter, leaving the field, or the arrow keys apply it. Invalid values show a message; Esc restores ----
    const errFor = k => panel.querySelector(`[data-err="${k}"]`);
    function showErr(input, on) {
      const k = input.dataset.n, r = ranges[k], el = errFor(k);
      input.setAttribute('aria-invalid', String(on));
      if (el) { el.hidden = !on; el.textContent = on ? `Enter a number from ${r.min} to ${r.max}${r.unit ? ' ' + r.unit : ''}. Esc restores ${S[k]}.` : ''; }
    }
    // A field is "typed" from the first keystroke until it is applied or restored. Only a typed field is applied when it is left,
    // so a field that merely had focus never writes an old value over a preset, a load or lab.set() chosen meanwhile.
    function restoreNum(input) { delete input.dataset.typed; input.value = S[input.dataset.n]; showErr(input, false); }
    function commitNum(input) {
      const k = input.dataset.n;
      if (!valid(k, input.value)) { showErr(input, true); return; }
      delete input.dataset.typed;
      showErr(input, false);
      if (String(+input.value) !== S[k]) { const next = { ...S, [k]: String(+input.value) }; remember(next); S = next; apply(); }
      input.value = S[k];
    }
    function stepNum(input, dir) {
      const k = input.dataset.n, r = ranges[k], base = valid(k, input.value) ? +input.value : +S[k];
      input.value = String(Math.min(+r.max, Math.max(+r.min, base + dir * +(r.step ?? 1))));
      commitNum(input);
    }

    function apply() {
      paint();
      panel.querySelectorAll('[data-reset-key]').forEach(b => {
        const changed = S[b.dataset.resetKey] !== first[b.dataset.resetKey]; b.hidden = !changed; b.disabled = !changed;
      });
      const undoButton = panel.querySelector('[data-act="undo"]'); if (undoButton) undoButton.disabled = !undoStack.length;
      const cur = currentPreset(S);
      panel.querySelectorAll('[data-k]').forEach(b => b.setAttribute('aria-pressed', String(S[b.dataset.k] === b.dataset.v)));
      panel.querySelectorAll('[data-preset]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.preset === cur)));
      // closed dropdowns show the current value and its mark. A custom mix is just "Custom mix".
      panel.querySelectorAll('[data-cur]').forEach(el => {
        const k = el.dataset.cur;
        if (k === ':preset') el.innerHTML = cur != null ? `<span>${esc(cur)}</span>${presetMarks(cur)}` : '<span>Custom mix</span>';
        else if (own(kind, k)) el.innerHTML = label(k, S[k], opts[k][1][S[k]] ?? S[k]);
      });
      panel.querySelectorAll('[data-s]').forEach(b => b.setAttribute('aria-checked', String(S[b.dataset.s] === 'on')));
      panel.querySelectorAll('[data-c]').forEach(c => { c.checked = S[c.dataset.c].split(',').includes(c.value); });
      panel.querySelectorAll('[data-r]').forEach(i => { const r = ranges[i.dataset.r]; i.value = S[i.dataset.r]; i.style?.setProperty?.('--p', ((+S[i.dataset.r] - +r.min) / (+r.max - +r.min) * 100) + '%'); });
      panel.querySelectorAll('[data-n]').forEach(i => { if (i !== document.activeElement || !i.dataset.typed) { delete i.dataset.typed; i.value = S[i.dataset.n]; showErr(i, false); } });
      const hash = '#' + new URLSearchParams(S);
      try { history.replaceState(null, '', hash); } catch (error) { try { if (location.hash !== hash) location.replace(hash); } catch (e) { /* state still works, only the address won't update */ } }
    }
    panel.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || b.closest?.('.lab-head') || b.hasAttribute?.('data-hold')) return;
      if (b.classList.contains('pd-btn')) { const w = b.closest('.pd'); setList(w, openWrap !== w, true); return; }
      if (b.classList.contains('tog')) { const s = b.closest('[data-sec]'); if (s) setSec(s.dataset.sec, s.classList.contains('shut')); return; }
      const inList = b.classList.contains('pd-item') ? b.closest('.pd') : null;
      if (b.dataset.resetKey) {
        const key = b.dataset.resetKey; resetControl(key);
        secEl(key)?.querySelector('input, .switch, .pd-btn, .tog')?.focus(); return;
      }
      const previous = { ...S };
      if (b.dataset.preset && own(presets, b.dataset.preset)) S = full(b.dataset.preset);
      else if (b.dataset.k) S = { ...S, [b.dataset.k]: b.dataset.v };
      else if (b.dataset.s) S = { ...S, [b.dataset.s]: S[b.dataset.s] === 'on' ? 'off' : 'on' };
      else if (b.dataset.act === 'reset') S = { ...first };
      else if (b.dataset.act === 'export') { downloadJSON(); return; }
      else if (b.dataset.act === 'import') { panel.querySelector('[data-import-file]').click(); return; }
      else return;
      const next = S; S = previous; remember(next); S = next;
      if (inList) { setList(null, false); inList.querySelector('.pd-btn')?.focus(); }
      apply();
    });
    panel.addEventListener('input', e => {
      const t = e.target;
      if (t.dataset?.r) { const next = { ...S, [t.dataset.r]: t.value }; remember(next, { range: t.dataset.r }); S = next; apply(); }
      else if (t.dataset?.n) t.dataset.typed = '1';
      else if (t.matches?.('[data-note]')) setNote(t.value);
      else if (t.matches?.('[data-q]')) { filterList(t.closest('.pd-list'), t.value); return; }   // number fields wait for Enter, blur or the arrows
    });
    panel.addEventListener('keydown', e => {
      const t = e.target;
      if (t?.dataset?.r && /^(Arrow(Up|Down|Left|Right)|Home|End|PageUp|PageDown)$/.test(e.key)) { rangeKey = t.dataset.r; return; }
      if (!t || !t.dataset || !t.dataset.n) return;
      if (e.key === 'Enter') { e.preventDefault(); commitNum(t); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); stepNum(t, e.key === 'ArrowUp' ? 1 : -1); }
    });
    panel.addEventListener('focusout', e => { const t = e.target; if (t?.dataset?.r) { rangeKey = null; finishRange(); apply(); } if (t?.dataset?.n) { if (t.dataset.typed) commitNum(t); else restoreNum(t); } });
    panel.addEventListener('pointerdown', e => { if (e.target?.dataset?.r) { rangeKey = null; finishRange(); } });
    panel.addEventListener('keyup', e => { if (e.target?.dataset?.r) { rangeKey = null; finishRange(); apply(); } });
    panel.addEventListener('change', async e => {
      const t = e.target;
      if (t.dataset?.r) { if (rangeKey !== t.dataset.r) finishRange(); apply(); return; }
      if (t.dataset?.c) { const k = t.dataset.c, on = [...panel.querySelectorAll(`[data-c="${k}"]`)].filter(c => c.checked).map(c => c.value); const next = { ...S, [k]: canon(k, on) }; remember(next); S = next; apply(); return; }
      if (t.dataset?.n) { commitNum(t); return; }
      const input = t.closest?.('[data-import-file]'); if (!input || !input.files?.[0]) return;
      const status = panel.querySelector('[data-export-status]');
      try { importJSON(await input.files[0].text(), input.files[0].name); status.textContent = loadNote; }
      catch (error) { status.textContent = error.message; }
      input.value = '';
    });
    addEventListener('hashchange', () => { const n = read(); if (!same(n, S)) { remember(n); S = n; apply(); } });
    addEventListener('keydown', e => {
      if ((e.key || '').toLowerCase() !== 'z' || !(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey || e.repeat || e.defaultPrevented || textFocus(e.target) || !labShown() || !undoStack.length) return;
      e.preventDefault(); e.stopImmediatePropagation(); undo();
    }, true);
    const savedTheme = store.get(THEME_KEY);
    setTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : theme);
    if (dock) warn('dock is no longer supported; the panel floats over the page.');
    setDock(false);
    setOpen(open);
    if (about) setAbout(store.get(ABOUT_KEY + id) === '1');
    apply();
    return {
      get state() { return { ...S }; },
      set(values) { const next = { ...S, ...Object.fromEntries(Object.entries(values || {}).filter(([k]) => own(kind, k)).map(([k, v]) => [k, canon(k, v)])) }; remember(next); S = next; apply(); },
      undo, resetControl, get canUndo() { return undoStack.length > 0; },
      get note() { return noteText; }, setNote,
      get configHash() { return configHash; },
      get loadMessage() { return loadNote; },   // the status line of the last successful load
      open: setOpen, dock: setDock, theme: setTheme, about: setAbout, exportJSON, downloadJSON, importJSON, fileName,
    };
  }
  window.VariantLab = { mount, viewport };
})();

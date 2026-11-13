const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const asset=process.env.VARIANT_LAB_ASSET||path.join(__dirname,'variant-lab.js');
function harness({failDownload=false}={}){
 const status={textContent:''},handlers={},downloads=[],revoked=[],win={};
 const element=()=>({dataset:{},hidden:false,setAttribute(){},classList:{toggle(){},contains(){return false}},addEventListener(type,fn){this.handlers??={};this.handlers[type]=fn;},append(){},remove(){},focus(){},querySelector(q){return q==='[data-export-status]'?status:element();},querySelectorAll(){return []},click(){if(failDownload)throw Error('blocked');downloads.push(this.download)}});
 const document={body:{append(...els){[handlers.panel,handlers.fab]=els}},createElement:element};
 const url={createObjectURL(){return 'blob:test'},revokeObjectURL(v){revoked.push(v)}};
 const context={window:{},document,location:{hash:'#density=roomy',href:'https://example.test/lab#density=roomy',pathname:'/lab'},history:{replaceState(){}},URL:url,URLSearchParams,Blob,addEventListener(t,fn){(win[t]??=[]).push(fn)},setTimeout(fn){fn()},navigator:{},console};
 vm.runInNewContext(fs.readFileSync(asset,'utf8'),context);
 const config={id:'example-lab',title:'Example',options:{density:['Density',{compact:'Compact',roomy:'Roomy'}],color:['Color',{plain:'Plain',ink:'Ink'}]},ranges:{size:{label:'Size',min:1,max:8,step:1}},presets:{Baseline:{density:'compact',color:'plain',size:'2'},Roomy:{density:'roomy',color:'ink',size:'4'}},notes:{density:'Compare reading comfort'},feedback:'Prefer roomier labels',render(){}};
 const lab=context.window.VariantLab.mount(config);
 return {lab,context,status,downloads,revoked,win,handlers,clickExport(){const button={dataset:{act:'export'},classList:{contains(){return false}}};handlers.panel.handlers.click({target:{closest(){return button}}})}};
}
test('full JSON reproduces baseline, URL-selected state, changes, preset and notes',()=>{
 const {lab}=harness(),data=JSON.parse(lab.exportJSON());
 assert.equal(data.schemaVersion,1);assert.equal(data.status,'unapproved');assert.equal(data.lab.id,'example-lab');
 assert.deepEqual(data.state,{density:'roomy',color:'plain',size:'2'});
});
test('export contains only declared controls, matches full preset and detaches snapshots',()=>{
 const {lab}=harness();lab.set({density:'roomy',color:'ink',size:'4',privateProfile:'PRIVATE_SENTINEL'});
 const json=lab.exportJSON(),data=JSON.parse(json);assert.equal(json.includes('PRIVATE_SENTINEL'),false);
 assert.equal(data.preset.current,'Roomy');assert.deepEqual(data.baseline,{density:'compact',color:'plain',size:'2'});
 assert.deepEqual(data.changes.size,{from:'2',to:'4'});assert.equal(data.notes.density,'Compare reading comfort');assert.equal(data.feedback,'Prefer roomier labels');assert.ok(data.previewUrl.startsWith('#'));assert.ok(Number.isFinite(Date.parse(data.exportedAt)));
 lab.set({color:'plain'});assert.equal(data.state.color,'ink');
});
test('Save selection button downloads and announces outcome; blocked download stays actionable',()=>{
 const ok=harness();ok.clickExport();assert.equal(ok.downloads.length,1);assert.match(ok.downloads[0],/example-lab.*\.json$/);assert.match(ok.status.textContent,/download/i);assert.deepEqual(ok.revoked,['blob:test']);
 const blocked=harness({failDownload:true});blocked.clickExport();assert.match(blocked.status.textContent,/could not|unable/i);assert.equal(blocked.revoked.length,1);
});
test('objects cannot be smuggled through a scalar control into export',()=>{
 const {lab}=harness();lab.set({density:{privateProfile:'PRIVATE_SENTINEL',toString(){return 'roomy'}}});
 assert.throws(()=>lab.exportJSON(),/invalid/i);
});
test('unknown URL fragment fields are excluded and full exported state round-trips',()=>{
 const first=harness();first.context.location.href='https://example.test/lab#privateProfile=PRIVATE_SENTINEL';
 first.lab.set({density:'roomy',size:'5'});const json=first.lab.exportJSON(),data=JSON.parse(json);assert.equal(json.includes('PRIVATE_SENTINEL'),false);
 const second=harness();second.lab.set(data.state);assert.deepEqual(JSON.parse(second.lab.exportJSON()).state,data.state);
});
test('Load saved selection restores an export, including across a fresh lab',()=>{
 const first=harness();first.lab.set({density:'roomy',color:'ink',size:'5'});const json=first.lab.exportJSON();
 const second=harness();second.lab.importJSON(json);assert.deepEqual({...second.lab.state},{density:'roomy',color:'ink',size:'5'});
});
test('presets written with numbers still match, and a lab without id gets a path-free id',()=>{
 const {context}=harness();
 const lab=context.window.VariantLab.mount({title:'Number Lab',options:{c:['C',{a:'A',b:'B'}]},ranges:{gap:{label:'Gap',min:8,max:64,step:4}},presets:{Today:{c:'a',gap:32},Calm:{c:'b',gap:40}},render(){}});
 lab.set({c:'b',gap:'40'});let data=JSON.parse(lab.exportJSON());assert.equal(data.preset.current,'Calm');
 lab.set({c:'a',gap:'32'});data=JSON.parse(lab.exportJSON());assert.deepEqual(data.changes,{});assert.equal(data.preset.current,'Today');
 assert.equal(data.lab.id,'number-lab');
});
test('presets are optional, and bad preset entries are ignored instead of breaking the baseline',()=>{
 const {context}=harness();
 const lab=context.window.VariantLab.mount({id:'no-presets',options:{c:['C',{a:'A',b:'B'}]},render(){}});
 let data=JSON.parse(lab.exportJSON());assert.equal(data.preset.baseline,'Today');assert.equal(data.baseline.c,'a');
 const lab2=context.window.VariantLab.mount({id:'bad-presets',options:{c:['C',{a:'A',b:'B'}]},presets:{Today:{c:'zzz',ghost:'1'}},render(){}});
 data=JSON.parse(lab2.exportJSON());assert.deepEqual(data.baseline,{c:'a'});
});
test('Loading fills controls added since the export from the baseline',()=>{
 const {lab}=harness();const data={schemaVersion:1,lab:{id:'example-lab'},state:{density:'roomy'}};
 lab.importJSON(JSON.stringify(data));assert.deepEqual({...lab.state},{density:'roomy',color:'plain',size:'2'});
});
test('checkboxes and switches: canonical values, presets with arrays, validation',()=>{
 const {context}=harness();
 const lab=context.window.VariantLab.mount({id:'kinds',checks:{extras:['Extras',{badge:'Badge',price:'Price',timer:'Timer'}]},switches:{shadow:'Shadow'},options:{c:['C',{a:'A',b:'B'}]},
  presets:{'Today (baseline)':{extras:[],c:'a'},'Badge + timer, shadow':{extras:['timer','badge'],shadow:'on',c:'b'}},render(){}});
 let data=JSON.parse(lab.exportJSON());assert.deepEqual(data.baseline,{c:'a',extras:'',shadow:'off'});
 lab.set({extras:['timer','badge'],shadow:'on',c:'b'});data=JSON.parse(lab.exportJSON());
 assert.equal(data.state.extras,'badge,timer');assert.equal(data.preset.current,'Badge + timer, shadow');
 assert.throws(()=>lab.importJSON(JSON.stringify({schemaVersion:1,lab:{id:'kinds'},state:{extras:'badge,ghost'}})),/Invalid value for extras/);
 assert.throws(()=>lab.importJSON(JSON.stringify({schemaVersion:1,lab:{id:'kinds'},state:{shadow:'maybe'}})),/Invalid value for shadow/);
 lab.importJSON(JSON.stringify({schemaVersion:1,lab:{id:'kinds'},state:{extras:'timer,price'}}));assert.equal(lab.state.extras,'price,timer');
});
test('saved file carries round, focus and the reviewer note, and is named by lab, round and change',()=>{
 const {context}=harness();
 const lab=context.window.VariantLab.mount({id:'promo-card',about:{question:'Q',round:2,focus:'Menu behavior'},options:{menu:['Menu',{scroll:'Scrolls',sticky:'Sticky'}]},
  presets:{'Today (baseline)':{menu:'scroll'},'Sticky menu':{menu:'sticky'}},render(){}});
 lab.set({menu:'sticky'});lab.setNote('Sticky reads better. Next: try a shorter menu.');
 const data=JSON.parse(lab.exportJSON());assert.equal(data.round,2);assert.equal(data.focus,'Menu behavior');assert.equal(data.reviewerNote,'Sticky reads better. Next: try a shorter menu.');
 assert.match(lab.fileName(),/^promo-card_r2\.0_sticky-menu_\d{4}-\d{2}-\d{2}\.json$/);
 const fresh=context.window.VariantLab.mount({id:'promo-card',about:{round:2},options:{menu:['Menu',{scroll:'Scrolls',sticky:'Sticky'}]},render(){}});
 fresh.importJSON(JSON.stringify(data));assert.equal(fresh.note,data.reviewerNote);assert.equal(fresh.state.menu,'sticky');
});
test('a custom mix is named after its nearest preset and the controls it changes',()=>{
 const {lab}=harness();lab.set({density:'roomy',color:'ink',size:'7'});
 assert.match(lab.fileName(),/^example-lab_roomy\+size_\d{4}-\d{2}-\d{2}\.json$/);
 const data=JSON.parse(lab.exportJSON());assert.equal(data.preset.current,null);assert.equal(data.preset.nearest,'Roomy');assert.deepEqual(data.preset.diffFromNearest,['size']);
});
test('nearest preset (fewest differences, ties to the first declared), diff list, file name and lab record',()=>{
 const {context}=harness();
 const lab=context.window.VariantLab.mount({id:'kit',about:{round:4,revision:2,question:'Q'},options:{focus:['Focus',{ring:'Ring',glow:'Glow'}]},
  ranges:{speed:{label:'Focus speed',min:0,max:400,step:20,unit:'ms'}},switches:{titles:'Row titles'},checks:{extras:['Extras',{badge:'Badge',rating:'Rating',price:'Price'}]},
  presets:{'Today (baseline)':{focus:'ring',speed:160,titles:'off',extras:''},'Glow focus, fast':{focus:'glow',speed:80,titles:'off',extras:''},'Titles on':{focus:'ring',speed:160,titles:'on',extras:'badge'}},render(){}});
 lab.set({focus:'glow',speed:200});
 let data=JSON.parse(lab.exportJSON());
 assert.equal(data.preset.current,null);assert.equal(data.preset.nearest,'Glow focus, fast');assert.deepEqual(data.preset.diffFromNearest,['speed']);
 assert.match(lab.fileName(),/^kit_r4\.2_glow-focus-fast\+speed_\d{4}-\d{2}-\d{2}\.json$/);
 lab.set({titles:'on',extras:['rating','badge']});   // 3 differences from Glow and from Titles on: the tie goes to Glow, declared first
 data=JSON.parse(lab.exportJSON());
 assert.equal(data.preset.nearest,'Glow focus, fast');assert.deepEqual(data.preset.diffFromNearest,['extras','titles','speed']);
 assert.match(lab.fileName(),/^kit_r4\.2_glow-focus-fast\+extras-titles-speed_\d{4}-\d{2}-\d{2}\.json$/);
 lab.set({titles:'off',extras:'',speed:80});   // exact match: no change list
 data=JSON.parse(lab.exportJSON());
 assert.equal(data.preset.current,'Glow focus, fast');assert.deepEqual(data.preset.diffFromNearest,[]);
 assert.match(lab.fileName(),/^kit_r4\.2_glow-focus-fast_\d{4}-\d{2}-\d{2}\.json$/);
 assert.equal(data.lab.version,'r4.2');assert.equal(data.lab.revision,2);assert.equal(data.lab.status,'Active');assert.equal(data.lab.configHash,lab.configHash);assert.equal(data.fileName,lab.fileName());assert.equal(data.basedOn,null);
});
test('configHash is 8 hex characters over kinds, option values, ranges and presets, not labels, notes or order',()=>{
 const make=o=>harness().context.window.VariantLab.mount(Object.assign({id:'hash',options:{c:['C',{a:'A',b:'B'}]},ranges:{g:{label:'G',min:8,max:64,step:4}},presets:{Today:{c:'a',g:24}}},o,{render(){}}));
 const h=make({}).configHash;
 assert.match(h,/^[0-9a-f]{8}$/);
 assert.equal(make({options:{c:['Other label',{a:'Alpha',b:'Beta'}]},notes:{c:'x'},order:['g','c']}).configHash,h);
 assert.notEqual(make({options:{c:['C',{a:'A',b:'B',z:'Z'}]}}).configHash,h);
 assert.notEqual(make({presets:{Today:{c:'a',g:32}}}).configHash,h);
});
test('the load message names the file, version, basis and note, and says what changed since the save',()=>{
 const {context}=harness();
 const VL=context.window.VariantLab;
 const old=VL.mount({id:'msg',about:{round:3,revision:1,question:'Q'},options:{menu:['Menu',{scroll:'Scrolls',sticky:'Sticky'}]},presets:{'Today (baseline)':{menu:'scroll'},'Sticky menu':{menu:'sticky'}},render(){}});
 old.set({menu:'sticky'});old.setNote('Sticky reads better.');
 const saved=old.exportJSON();
 const same=VL.mount({id:'msg',about:{round:3,revision:1},options:{menu:['Menu',{scroll:'Scrolls',sticky:'Sticky'}]},presets:{'Today (baseline)':{menu:'scroll'},'Sticky menu':{menu:'sticky'}},render(){}});
 same.importJSON(saved,'msg_r3.1_sticky-menu_2026-11-03.json');
 assert.match(same.loadMessage,/^Loaded msg_r3\.1_sticky-menu_2026-11-03\.json · saved from lab r3\.1 on \d{4}-\d{2}-\d{2} · based on "Sticky menu" · note restored$/);
 assert.equal(JSON.parse(same.exportJSON()).basedOn,'msg_r3.1_sticky-menu_2026-11-03.json');
 const later=VL.mount({id:'msg',about:{round:4,revision:0},options:{menu:['Menu',{scroll:'Scrolls',sticky:'Sticky'}],focus:['Focus',{ring:'Ring',glow:'Glow'}]},presets:{'Today (baseline)':{menu:'scroll'},'Sticky menu':{menu:'sticky'}},render(){}});
 later.importJSON(saved);
 assert.match(later.loadMessage,/ This lab has changed since \(now r4\.0\): 1 control filled from baseline: focus\.$/);
 assert.equal(later.state.focus,'ring');
 const tuned=VL.mount({id:'msg',about:{round:4,revision:1},options:{menu:['Menu',{scroll:'Scrolls',sticky:'Sticky'}]},presets:{'Today (baseline)':{menu:'scroll'},'Sticky menu':{menu:'sticky'},'New idea':{menu:'sticky'}},render(){}});
 tuned.importJSON(saved);
 assert.match(tuned.loadMessage,/ This lab has changed since \(now r4\.1\); every saved control still exists, so nothing was filled in\.$/);
 assert.equal(tuned.loadMessage.includes('0 controls'),false);
});
test('the load message shows the local calendar day of the save, the same rule as the file name',()=>{
 const {context}=harness();const VL=context.window.VariantLab;
 const lab=VL.mount({id:'day',about:{round:1},options:{c:['C',{a:'A',b:'B'}]},render(){}});
 const at='2026-11-03T23:30:00.000Z',d=new Date(at),p=x=>String(x).padStart(2,'0'),local=`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
 lab.importJSON(JSON.stringify({schemaVersion:1,lab:{id:'day',version:'r1.0'},state:{c:'b'},exportedAt:at}));
 assert.match(lab.loadMessage,new RegExp('saved from lab r1\\.0 on '+local+'( |$)'));
 assert.match(lab.fileName(),new RegExp('_'+(()=>{const n=new Date();return `${n.getFullYear()}-${p(n.getMonth()+1)}-${p(n.getDate())}`;})()+'\\.json$'));
});
test('only two marks, a star (AI pick) and a dot (new), one per item; picked, baseline, who and round are not drawn; slider ends sit beside the bar',()=>{
 const h=harness();
 h.context.window.VariantLab.mount({id:'pick',about:{round:2},ranges:{gap:{label:'Gap',min:8,max:64,step:4,unit:'px'}},switches:{titles:'Row titles'},options:{c:['C',{a:'A',b:'B',x:'X'}]},
  picked:{gap:40,titles:'on',c:'b'},recommend:{c:['b']},fresh:{gap:['range'],c:['b','x']},presets:{Today:{gap:24,titles:'off',c:'a'},'Try X':{c:'x'},'Old B':{c:'b'}},
  presetInfo:{'Try X':{by:'ai',round:2},'Old B':{by:'you',round:1,preferred:true}},render(){}});
 const html=h.handlers.panel.innerHTML;
 assert.equal(/class="(pick|now|star|by|rd)[" ]|pk-tick|class="tick|Your pick|today 24|AI PICK|>NEW</.test(html),false);
 assert.match(html,/<span>Gap<\/span><i class="new" role="img" title="New this round" aria-label="New this round"><\/i>/);
 assert.match(html,/<span>B<\/span><i class="ai" role="img" title="[^"]+" aria-label="AI pick"><svg[^>]*><path d="M8 1\.5[^"]*"\/><\/svg><\/i><\/span><\/button>/);   // recommended and new: the star only
 assert.match(html,/<span>X<\/span><i class="new"[^>]*><\/i><\/span><\/button>/);
 assert.match(html,/<span>Try X<\/span><i class="new"/);assert.match(html,/<span>Old B<\/span><\/span>/);   // a preset from this round gets the dot; older ones carry no mark
 assert.match(html,/<div class="rwrap"><span class="end" aria-hidden="true">8<\/span><input class="rng"[^>]*><span class="end" aria-hidden="true">64<\/span><\/div>/);
 assert.match(html,/<div class="r2"><span class="num-wrap"><input class="num"/);   // number field and slider on one line
});
test('single choices are dropdowns with a tick, archived values sit in an Archive group of the menu, checks stay one column',()=>{
 const h=harness();
 h.context.window.VariantLab.mount({id:'dd',options:{c:['C',{a:'A',b:'B',z:'Z'}]},checks:{x:['X',{p:'P',q:'Q'}]},archive:{c:['z'],x:['q']},presets:{Today:{c:'a',x:''}},render(){}});
 const html=h.handlers.panel.innerHTML;
 assert.equal(html.includes('class="opts"'),false);
 assert.match(html,/<div class="pd"><button type="button" class="pd-btn" aria-haspopup="true" aria-expanded="false" aria-controls="lab-dd-\d+"/);
 assert.match(html,/<button type="button" class="pd-item" data-k="c" data-v="a" title="A"><span class="pd-tk"><svg/);
 assert.match(html,/<p class="pd-g">Archive<\/p><button type="button" class="pd-item" data-k="c" data-v="z"/);
 assert.match(html,/<div class="chks" role="group" aria-label="X"><label class="chk" title="P"><input type="checkbox" data-c="x" value="p">/);
 assert.match(html,/data-sec=":archive"[^>]*>.*<span class="c">1<\/span>/s);   // only archived checks go to the Archive section
 assert.match(html,/<div class="sec shut" data-sec=":archive"/);
});
test('the Note is a closed section, the footer is Reset · Load saved · Save selection, and there is no pin button or "based on" text',()=>{
 const h=harness();
 const lab=h.context.window.VariantLab.mount({id:'nb',options:{c:['C',{a:'A',b:'B'}]},presets:{Today:{c:'a'}},render(){}});
 const html=h.handlers.panel.innerHTML;
 assert.match(html,/<div class="sec shut" data-sec=":note" data-note-box><div class="lbl"><button type="button" class="tog" aria-expanded="false"[^>]*><span class="sec-chev">.*?<\/span><span>Note<\/span><\/button><\/div><div class="sc" id="lab-sc-\d+" hidden><textarea/s);
 assert.match(html,/data-act="reset"[^>]*>Reset<\/button><span class="sp"><\/span><button type="button" data-act="import"[^>]*>Load saved<\/button><button type="button" class="strong" data-act="export"[^>]*>Save selection<\/button>/);
 assert.equal(html.includes('data-act="note"'),false);
 assert.equal(/class="ico dock"|data-diff|Based on|saved with the selection<\/span>/.test(html),false);
 lab.set({c:'b'});assert.equal(lab.state.c,'b');
});
test('notes are not drawn as text in the panel: they become the row tooltip, CONFIRM gets a "?" marker, and the file keeps them',()=>{
 const h=harness();
 const lab=h.context.window.VariantLab.mount({id:'notes',options:{c:['C',{a:'A',b:'B'}]},ranges:{gap:{label:'Gap',min:8,max:64,step:4}},
  notes:{c:'Decided in round 1: sticky.',gap:'Today: 24 px (CONFIRM).'},presets:{Today:{c:'a',gap:24}},render(){}});
 const html=h.handlers.panel.innerHTML;
 assert.equal(html.includes('lab-hint'),false);assert.equal(html.includes('class="legend"'),false);
 assert.match(html,/<span id="lab-nm-\d+" title="Decided in round 1: sticky\.">C<\/span>/);
 assert.match(html,/<i class="cfm" role="img" title="Today: 24 px \(CONFIRM\)\."[^>]*>\?<\/i>/);
 assert.equal((html.match(/class="cfm"/g)||[]).length,1);
 assert.deepEqual(JSON.parse(lab.exportJSON()).notes,{c:'Decided in round 1: sticky.',gap:'Today: 24 px (CONFIRM).'});
 assert.match(html,/aria-label="Hold B to compare"[^>]*>Hold <kbd>B<\/kbd><\/button>/);
 const off=h.context.window.VariantLab.mount({id:'nokey',options:{c:['C',{a:'A',b:'B'}]},compareKey:null,render(){}});
 assert.match(h.handlers.panel.innerHTML,/>Hold to compare</);
});
test('holding B renders the baseline and releases; the selection, the hash and the stored note do not change',()=>{
 const h=harness(),shown=[];
 const lab=h.context.window.VariantLab.mount({id:'hold',options:{c:['C',{a:'A',b:'B'}]},presets:{Today:{c:'a'},Other:{c:'b'}},render(s){shown.push(s.c)}});
 lab.set({c:'b'});lab.open(true);
 const fire=(type,ev)=>(h.win[type]||[]).forEach(fn=>fn({preventDefault(){},repeat:false,target:{tagName:'DIV'},...ev}));
 fire('keydown',{key:'b'});assert.equal(shown.at(-1),'a');assert.equal(lab.state.c,'b');
 fire('keyup',{key:'b'});assert.equal(shown.at(-1),'b');assert.equal(lab.state.c,'b');
 fire('keydown',{key:'b',target:{tagName:'INPUT',type:'text'}});assert.equal(shown.at(-1),'b');   // typing in a text field does not compare
 fire('keyup',{key:'b'});
 fire('keydown',{key:'b',ctrlKey:true});assert.equal(shown.at(-1),'b');                           // with a modifier it is not the compare key
 fire('keyup',{key:'b'});
 lab.open(false);fire('keydown',{key:'b'});assert.equal(shown.at(-1),'a');                        // panel closed: compare still works
 fire('keyup',{key:'b'});assert.equal(shown.at(-1),'b');assert.equal(lab.state.c,'b');
});
test('Loading rejects bad files whole and leaves the selection untouched',()=>{
 const {lab}=harness();lab.set({color:'ink'});const before={...lab.state};
 const bad=[['not json',/valid JSON/],[JSON.stringify({schemaVersion:2,lab:{id:'example-lab'},state:{}}),/not a lab selection/],
  [JSON.stringify({schemaVersion:1,lab:{id:'other'},state:{}}),/another lab/],
  [JSON.stringify({schemaVersion:1,lab:{id:'example-lab'},state:{privateProfile:'x'}}),/Unknown controls/],
  [JSON.stringify({schemaVersion:1,lab:{id:'example-lab'},state:{density:'roomy',color:'neon'}}),/Invalid value for color/],
  [JSON.stringify({schemaVersion:1,lab:{id:'example-lab'},state:{size:'99'}}),/Invalid value for size/],
  [JSON.stringify({schemaVersion:1,lab:{id:'example-lab'},state:{density:{toString(){return 'roomy'}}}}),/Invalid value|Unknown/]];
 for(const [text,re] of bad.slice(0,6)) {assert.throws(()=>lab.importJSON(text),re);assert.deepEqual({...lab.state},before);}
});

test('undo returns the previous full selection; no-op edits and baseline hold add no history',()=>{
 const h=harness(),initial={...h.lab.state};
 assert.equal(h.lab.canUndo,false);
 h.lab.set({size:'5',color:'ink'});assert.equal(h.lab.canUndo,true);
 h.lab.set({size:'5'});
 assert.equal(h.lab.undo(),true);assert.deepEqual({...h.lab.state},initial);
 assert.equal(h.lab.canUndo,false);assert.equal(h.lab.undo(),false);
});
test('Command+Z and Control+Z undo selections, but text inputs and redo chords remain native',()=>{
 const h=harness();h.lab.set({size:'5'});
 function key(extra={}){const e={key:'z',metaKey:true,ctrlKey:false,altKey:false,shiftKey:false,target:{tagName:'BUTTON'},preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true},...extra};(h.win.keydown||[]).forEach(fn=>fn(e));return e;}
 const input=key({target:{tagName:'INPUT',type:'text'}});assert.equal(input.prevented,undefined);assert.equal(h.lab.state.size,'5');
 key({target:{isContentEditable:true}});assert.equal(h.lab.state.size,'5');
 key({shiftKey:true});assert.equal(h.lab.state.size,'5');
 const undone=key();assert.equal(undone.prevented,true);assert.equal(h.lab.state.size,'2');
 h.lab.set({color:'ink'});key({metaKey:false,ctrlKey:true});assert.equal(h.lab.state.color,'plain');
});
test('resetControl restores only one baseline value and can itself be undone',()=>{
 const {lab}=harness();lab.set({density:'compact',size:'6',color:'ink'});
 assert.equal(lab.resetControl('size'),true);assert.equal(lab.state.size,'2');assert.equal(lab.state.color,'ink');assert.equal(lab.state.density,'compact');
 lab.undo();assert.equal(lab.state.size,'6');assert.equal(lab.resetControl('unknown'),false);
});
test('a slider drag is one undo action and a later drag is a second action',()=>{
 const h=harness(),slider={dataset:{r:'size'},value:'3'};
 const input=()=>h.handlers.panel.handlers.input({target:slider});
 input();slider.value='4';input();slider.value='5';input();
 h.handlers.panel.handlers.change({target:slider});
 slider.value='6';input();h.handlers.panel.handlers.change({target:slider});
 h.lab.undo();assert.equal(h.lab.state.size,'5');h.lab.undo();assert.equal(h.lab.state.size,'2');assert.equal(h.lab.canUndo,false);
});
test('successful import is one undo action that restores state and imported note; failure adds none',()=>{
 const h=harness();h.lab.setNote('Original note');const initial={...h.lab.state};
 const data=JSON.parse(h.lab.exportJSON());data.state.size='7';data.reviewerNote='Imported note';data.fileName='choice.json';
 h.lab.importJSON(JSON.stringify(data));assert.equal(h.lab.note,'Imported note');
 h.lab.undo();assert.deepEqual({...h.lab.state},initial);assert.equal(h.lab.note,'Original note');assert.equal(h.lab.canUndo,false);
 data.lab.id='wrong';assert.throws(()=>h.lab.importJSON(JSON.stringify(data)),/another lab/);assert.equal(h.lab.canUndo,false);
});
test('undo of a selection preserves a note edited afterwards',()=>{
 const h=harness();h.lab.set({size:'7'});h.lab.setNote('Keep this new note');h.lab.undo();assert.equal(h.lab.note,'Keep this new note');
});
test('per-control restore buttons and Undo use explicit accessible labels',()=>{
 const h=harness(),html=h.handlers.panel.innerHTML;
 assert.match(html,/data-reset-key="size"/);assert.match(html,/Restore Size to baseline/);
 assert.match(html,/data-act="undo"/);assert.match(html,/aria-label="Undo last selection change"/);
});

test('preset and global Reset clicks undo as full transactions; per-control click preserves other values',()=>{
 const h=harness(),start={...h.lab.state};
 const click=dataset=>h.handlers.panel.handlers.click({target:{closest(){return {dataset,classList:{contains(){return false}}}}}});
 click({preset:'Roomy'});assert.equal(h.lab.state.color,'ink');h.lab.undo();assert.deepEqual({...h.lab.state},start);
 h.lab.set({size:'6',color:'ink'});click({resetKey:'size'});assert.equal(h.lab.state.size,'2');assert.equal(h.lab.state.color,'ink');
 click({act:'reset'});assert.equal(h.lab.state.color,'plain');h.lab.undo();assert.equal(h.lab.state.color,'ink');assert.equal(h.lab.state.size,'2');
});
test('range return to starting value adds no undo entry and baseline compare adds none',()=>{
 const h=harness(),slider={dataset:{r:'size'},value:'5'};
 h.handlers.panel.handlers.input({target:slider});slider.value='2';h.handlers.panel.handlers.input({target:slider});h.handlers.panel.handlers.change({target:slider});assert.equal(h.lab.canUndo,false);
 const e={key:'b',target:{tagName:'BODY'}};(h.win.keydown||[]).forEach(fn=>fn(e));(h.win.keyup||[]).forEach(fn=>fn(e));assert.equal(h.lab.canUndo,false);
});
test('undoing an import preserves a reviewer note changed after import and restores provenance',()=>{
 const h=harness(),data=JSON.parse(h.lab.exportJSON());data.state.size='7';data.fileName='received.json';data.reviewerNote='Imported';
 h.lab.importJSON(JSON.stringify(data));h.lab.setNote('New feedback');h.lab.undo();assert.equal(h.lab.note,'New feedback');assert.equal(JSON.parse(h.lab.exportJSON()).basedOn,null);
});

test('repeated range key presses until keyup form one undo action even with native change events',()=>{
 const h=harness(),slider={dataset:{r:'size'},value:'3'};
 h.handlers.panel.handlers.keydown({target:slider,key:'ArrowRight'});
 for(const value of ['3','4','5']){slider.value=value;h.handlers.panel.handlers.input({target:slider});h.handlers.panel.handlers.change({target:slider});}
 h.handlers.panel.handlers.keyup({target:slider,key:'ArrowRight'});
 h.lab.undo();assert.equal(h.lab.state.size,'2');assert.equal(h.lab.canUndo,false);
});

test('invalid import metadata is rejected before state, note, or undo history changes',()=>{
 const h=harness();h.lab.setNote('Keep original');const initial={...h.lab.state};
 const data=JSON.parse(h.lab.exportJSON());data.state.size='7';data.reviewerNote='Do not apply';data.lab.version={toString:null};
 assert.throws(()=>h.lab.importJSON(JSON.stringify(data)),/metadata/i);assert.deepEqual({...h.lab.state},initial);assert.equal(h.lab.note,'Keep original');assert.equal(h.lab.canUndo,false);
});

test('import undo preserves a note edited away and back, while consecutive import undo restores note lineage',()=>{
 const h=harness();h.lab.setNote('Original');const a=JSON.parse(h.lab.exportJSON());a.state.size='6';a.reviewerNote='A';a.fileName='a.json';h.lab.importJSON(JSON.stringify(a));
 h.lab.setNote('Changed');h.lab.setNote('A');h.lab.undo();assert.equal(h.lab.note,'A');
 const q=harness();q.lab.setNote('Original');q.lab.importJSON(JSON.stringify(a));const b={...a,state:{...a.state,size:'7'},reviewerNote:'B',fileName:'b.json'};q.lab.importJSON(JSON.stringify(b));q.lab.undo();assert.equal(q.lab.note,'A');q.lab.undo();assert.equal(q.lab.note,'Original');
});
test('a no-op range excursion does not evict committed history at the history limit',()=>{
 const h=harness();for(let i=0;i<100;i++)h.lab.set({color:i%2?'plain':'ink'});
 const slider={dataset:{r:'size'},value:'5'};h.handlers.panel.handlers.input({target:slider});slider.value='2';h.handlers.panel.handlers.input({target:slider});h.handlers.panel.handlers.change({target:slider});
 let count=0;while(h.lab.undo())count++;assert.equal(count,100);
});

test('selection preview context excludes local paths, origin credentials and query strings',()=>{
 for(const href of ['file:///Users/private-owner/secret-project/index.html?token=QUERY_SENTINEL#unknown=PRIVATE_SENTINEL','https://user:PASSWORD_SENTINEL@example.test/private-lab?token=QUERY_SENTINEL#unknown=PRIVATE_SENTINEL']){
  const h=harness();h.context.location.href=href;const data=JSON.parse(h.lab.exportJSON());
  assert.ok(data.previewUrl.startsWith('#'));assert.equal(data.previewUrl,'#'+new URLSearchParams(data.state));
  assert.equal(/private-owner|secret-project|PASSWORD_SENTINEL|QUERY_SENTINEL|PRIVATE_SENTINEL/.test(data.previewUrl),false);
 }
});

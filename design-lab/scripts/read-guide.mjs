#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const workflow='design-lab/references/workflow.md';
const runtime='variant-lab/references/runtime-guide.md';
const tasks=['adjust','build','controls','selection','match','verify','apply','full'];
const W={decision:'1. Establish the next decision',mode:'2. Select the working mode',names:'3. Name directions for an independent reviewer',cases:'4. Generate the component cases before fine adjustment',controls:'5. Provide controls for the requested adjustments',recovery:'Recover a selection',tools:'6. Keep the preview visible and unchanged by the tools',verify:'7. Verify fidelity and behavior',save:'8. Save the decision for the next round',retain:'Retain the record and improve the method'};
const V={build:'Build procedure',history:'Directions, descriptions, and history',controls:'Controls and groups',help:'Descriptions, notes, and markers',tools:'Floating tools and themes',keyboard:'Keyboard and clean captures',recovery:'Undo and individual restore',save:'Save and restore',api:'API reference'};
export function readingPlan({task,target,system=false,reference=false}={}){
 if(!tasks.includes(task))throw Error('Unknown task. Use '+tasks.join(', ')+'.');
 if(!['page','component'].includes(target))throw Error('Specify target: page or component. Use component if uncertain.');
 const plan=[];
 const add=(p,sections=['*'])=>{const old=plan.find(x=>x.path===p);if(!old){plan.push({path:p,sections:[...sections]});return;}old.sections=old.sections.includes('*')||sections.includes('*')?['*']:[...new Set([...old.sections,...sections])];};
 add('variant-lab/SKILL.md');
 add('design-lab/references/core.md');
 add('variant-lab/references/panel-integration.md');
 add('variant-lab/references/verification.md');
 add(workflow,['Terms']);
 if(['adjust','match','apply'].includes(task)){
  add(workflow,[W.decision,W.mode,W.names,W.save,W.retain]);add(runtime,[V.history]);
 }
 if(task==='build'||task==='full'){
  add(workflow);add(runtime);add('variant-lab/references/panel-controls.md');add('design-lab/references/build-phases.md');
 }
 if(task==='controls'){
  add(workflow,[W.decision,W.mode,W.names,W.controls,W.recovery,W.tools,W.save,W.retain]);
  add(runtime,['Runtime and generated integration',V.build,V.history,V.controls,V.help,V.tools,V.keyboard,V.recovery,V.save,V.api]);
  add('variant-lab/references/panel-controls.md');
 }
 if(task==='selection'){
  add(workflow,[W.decision,W.recovery,W.save,W.retain]);add(runtime,[V.history,V.tools,V.keyboard,V.recovery,V.save,V.api]);
 }
 // Every handoff retains the complete fidelity/behavior check, not only new-reference work.
 add(workflow,[W.verify]);
 if(task==='match'||reference)add(workflow,[W.verify]);
 if(target==='component'){add(workflow,[W.cases]);add('design-lab/references/component-cases.md');}
 if(system||task==='full')add('design-lab/references/contextual-inspectors.md');
 if(task==='apply')add('design-lab/references/build-phases.md');
 add('design-lab/DESIGN_PRINCIPLES.md');
 return plan;
}
export function sectionText(text,names,source){
 if(names.includes('*'))return text.trim();
 const lines=text.split('\n'),heads=[];
 for(let i=0;i<lines.length;i++){const m=/^## (.+)$/.exec(lines[i]);if(m)heads.push({name:m[1],line:i});}
 return names.map(name=>{
  const i=heads.findIndex(x=>x.name===name);
  if(i<0)throw Error('Missing required section '+name+' in '+source);
  return lines.slice(heads[i].line,heads[i+1]?.line??lines.length).join('\n').trim();
 }).join('\n\n');
}
export function readGuidance(options){
 return readingPlan(options).map(item=>{
  const filename=path.join(root,item.path);
  const text=fs.readFileSync(filename,'utf8');
  return '# Source: '+item.path+'\n\n'+sectionText(text,item.sections,item.path);
 }).join('\n\n');
}
function main(args){
 if(args.includes('--help')){
  console.log('Usage: node <design-lab>/scripts/read-guide.mjs --task <'+tasks.join('|')+'> --target <page|component> [--system] [--reference] [--list]\nAdd --system for selected parts, tokens, exceptions or uncertain domains. Add --reference for matching. --list shows source locations only; it does not satisfy required reading. Without Node, read the same listed files/sections manually. Reuse unchanged rules already in current context; never skip applicable requirements or tests for a budget.');return;
 }
 const o={};let list=false;
 for(let i=0;i<args.length;i++){
  const a=args[i];
  if(a==='--task'||a==='--target'){if(!args[i+1]||args[i+1].startsWith('--'))throw Error('Missing value for '+a);o[a.slice(2)]=args[++i];}
  else if(a==='--system')o.system=true;
  else if(a==='--reference')o.reference=true;
  else if(a==='--list')list=true;
  else throw Error('Unknown argument '+a);
 }
 console.log(list?JSON.stringify(readingPlan(o),null,2):readGuidance(o));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{main(process.argv.slice(2));}catch(error){console.error(error.message);process.exitCode=1;}
}

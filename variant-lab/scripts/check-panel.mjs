#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const assets=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../assets');
const names=['lab-chrome.css','lab-chrome.js','variant-lab.css','variant-lab.js'];
const hash=x=>createHash('sha256').update(x).digest('hex');
export function checkPanel(manifestPath){
 const problems=[],record={scope:'source integration only',problems};
 try {
  const base=path.dirname(path.resolve(manifestPath)),m=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  if(!m.entry||!m.binding||!m.runtimeDir||!Array.isArray(m.adapters))throw Error('Require entry, binding, runtimeDir and adapters.');
  const resolve=p=>{if(typeof p!=='string'||path.isAbsolute(p))throw Error('Use relative paths.');return path.resolve(base,p);};
  const sources=[m.entry,m.binding,...m.adapters].map(p=>({path:resolve(p),text:fs.readFileSync(resolve(p),'utf8')}));
  if(!sources.some(s=>/\bVariantLab\.mount\s*\(/.test(s.text)))problems.push('No VariantLab.mount binding. A custom panel is not a replacement.');
  record.runtime={};
  for(const name of names){
   const target=path.join(resolve(m.runtimeDir),name),expected=fs.readFileSync(path.join(assets,name));
   const actual=fs.readFileSync(target);
   record.runtime[name]=hash(actual);
   if(hash(actual)!==hash(expected))problems.push(`${name}: differs from this installed runtime. Keep adaptations separate.`);
   // This is a lexical integration check, not a JavaScript or browser execution proof.
   const referenced=sources.some(s=>[...s.text.matchAll(/["']([^"'\n]+)["']/g)].some(match=>path.resolve(path.dirname(s.path),match[1])===target));
   if(!referenced)problems.push(`${name}: not referenced by the declared entry, binding or adapters.`);
  }
 }catch(e){problems.push(e.message);}
 record.ok=problems.length===0;return record;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=checkPanel(process.argv[2]||'panel-contract.json');console.log(JSON.stringify(result,null,2));process.exitCode=result.ok?0:1;
}

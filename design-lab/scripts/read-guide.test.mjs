import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readingPlan,readGuidance,sectionText} from './read-guide.mjs';

test('adjust keeps mandatory gates but excludes irrelevant API examples',()=>{
 const text=readGuidance({task:'adjust',target:'page'});
 assert.match(text,/Required panel integration/);
 assert.match(text,/Verify and hand over/);
 assert.match(text,/Establish the next decision/);
 assert.match(text,/Save the decision/);
 assert.doesNotMatch(text,/const lab = VariantLab.mount/);
});
test('component task includes the complete fixture contract',()=>{
 assert.match(readGuidance({task:'adjust',target:'component'}),/Required card combinations/);
});
test('system flag keeps recommendation and export validation paths',()=>{
 const text=readGuidance({task:'adjust',target:'component',system:true});
 assert.match(text,/recommendation, export, and application/);
 assert.match(text,/Handle an explicit exception/);
});
test('reference matching includes controlled render and tolerances',()=>{
 const text=readGuidance({task:'match',target:'page'});
 assert.match(text,/device-pixel ratio/);assert.match(text,/tolerances/);
});
test('new controls include API, validation and state recovery contracts',()=>{
 const text=readGuidance({task:'controls',target:'component'});
 assert.match(text,/const lab = VariantLab.mount/);
 assert.match(text,/Undo and individual restore/);
 assert.match(text,/whole|in full/);
});
test('full reading keeps all source manuals and existing reference branches',()=>{
 const p=readingPlan({task:'full',target:'component'});
 assert.ok(p.some(x=>x.path.endsWith('contextual-inspectors.md')));
 assert.ok(p.some(x=>x.path.endsWith('build-phases.md')));
});
test('unknown tasks and missing targets fail instead of picking a cheap route',()=>{
 assert.throws(()=>readingPlan({task:'tiny',target:'page'}),/task/i);
 assert.throws(()=>readingPlan({task:'adjust'}),/target/i);
});

test('missing required headings fail instead of silently omitting rules',()=>{assert.throws(()=>sectionText('## Other\ntext',['Required'],'fixture'),/Missing required section/);});

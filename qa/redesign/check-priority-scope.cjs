/** Shared applied-scope invariants. Run with node qa/redesign/check-priority-scope.cjs. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const esbuild = require('esbuild');
const root = path.resolve(__dirname, '../..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'assort-priority-scope-'));
const output = path.join(temp, 'scope.cjs');
const checks = [];
const check = (name, fn) => { fn(); checks.push({ name, pass: true }); };
const originalWindow = global.window;
const storage = new Map();
function browser() {
  const target = new EventTarget();
  target.sessionStorage = { getItem:key=>storage.get(key)??null, setItem:(key,value)=>storage.set(key,String(value)), removeItem:key=>storage.delete(key) };
  global.window = target;
  return target;
}
function fresh() { delete require.cache[require.resolve(output)]; return require(output); }
try {
  esbuild.buildSync({
    absWorkingDir:root,
    stdin:{contents:`export * from './src/modules/hindsight/priority/flooringScope'; export { getFlooringTotals,getFlooringMixRows,getFlooringStores } from './src/mocks/flooringDemo';`,resolveDir:root,loader:'ts'},
    outfile:output,bundle:true,format:'cjs',platform:'node',target:'node22',logLevel:'silent',
  });
  let win = browser(), api = fresh();
  const plan = 'PLAN-KB-001', key = `assort-flooring-scope:${plan}`;
  const full = structuredClone(api.getFlooringScope(plan));
  check('Fresh shared scope covers all 72 canonical flooring products and exact headline totals',()=>{
    assert.equal(full.find(e=>e.levelNo==='l2_name').selectedValues.length,5);
    const total=api.getFlooringTotals(api.flooringScopeFilters(full));
    assert.equal(total.itemCount,72);assert.equal(total.sales,8400000);assert.equal(total.units,182400);
  });
  check('Editing an unapplied draft leaves the committed scope unchanged',()=>{
    const draft=structuredClone(full);draft.find(e=>e.levelNo==='l1_name').selectedValues=['Bamboo'];
    assert.deepEqual(api.getFlooringScope(plan),full);
  });
  const cut=structuredClone(full);cut.find(e=>e.levelNo==='l1_name').selectedValues=['Hardwood'];
  let event;win.addEventListener(api.FLOORING_SCOPE_EVENT,e=>event=e.detail);
  api.applyFlooringScope(cut,plan);
  check('Apply publishes one plan-specific revision and persists the same filter selection',()=>{
    assert.equal(event.planCode,plan);assert.equal(event.revision,1);assert.deepEqual(event.scope,cut);
    assert.deepEqual(api.getFlooringScope(plan),cut);
    assert.deepEqual(JSON.parse(storage.get(key)).scope,cut);
    const strip=JSON.parse(storage.get(`filterStrip:${plan}`));
    assert.deepEqual(strip.groups.find(e=>e.key==='l1_name').values.map(v=>v.id),['Hardwood']);
  });
  check('A committed category cut reconciles summary, brand rows and stores',()=>{
    const filters=api.flooringScopeFilters(api.getFlooringScope(plan));
    const totals=api.getFlooringTotals(filters), brands=api.getFlooringMixRows('brand',filters), stores=api.getFlooringStores(filters);
    assert(totals.sales>0&&totals.sales<8400000);assert(totals.itemCount>0&&totals.itemCount<72);
    assert(Math.abs(brands.reduce((n,r)=>n+r.sales,0)-totals.sales)<.01);
    assert(Math.abs(stores.reduce((n,r)=>n+r.sales,0)-totals.sales)<.01);
    assert.equal(brands.reduce((n,r)=>n+r.units,0),totals.units);
    assert.equal(stores.reduce((n,r)=>n+r.quantity,0),totals.units);
  });
  api=fresh();
  check('A document reload restores the committed cut from versioned tab storage',()=>assert.deepEqual(api.getFlooringScope(plan),cut));
  check('Select All exclusions keep their raw recipe while chips show the effective values',()=>{
    const recipe=structuredClone(full);Object.assign(recipe.find(e=>e.levelNo==='l1_name'),{selectedValues:[],selectAll:true,except:['Bamboo']});
    api.applyFlooringScope(recipe,plan);
    assert.deepEqual(api.getFlooringScope(plan).find(e=>e.levelNo==='l1_name').selectedValues,[]);
    assert.equal(api.getFlooringScope(plan).find(e=>e.levelNo==='l1_name').selectAll,true);
    const strip=JSON.parse(storage.get(`filterStrip:${plan}`));
    assert.deepEqual(new Set(strip.groups.find(e=>e.key==='l1_name').values.map(v=>v.id)),new Set(['Hardwood','Engineered Hardwood']));
    assert(!strip.groups.find(e=>e.key==='l2_name').values.some(v=>v.id==='Stranded Bamboo'));
    api.applyFlooringScope(cut,plan);
  });
  check('Explicit empty selection shows an empty population rather than silently broadening to all',()=>{
    const empty=structuredClone(full);empty.find(e=>e.levelNo==='l1_name').selectedValues=[];
    api.applyFlooringScope(empty,plan);
    assert.equal(api.getFlooringTotals(api.flooringScopeFilters(api.getFlooringScope(plan))).itemCount,0);
    assert.deepEqual(JSON.parse(storage.get(`filterStrip:${plan}`)).groups,[]);
    api.applyFlooringScope(cut,plan);
  });
  const four=structuredClone(full);four.find(e=>e.levelNo==='l2_name').selectedValues=four.find(e=>e.levelNo==='l2_name').selectedValues.filter(v=>v!=='Hand Scraped Hardwood');
  storage.clear();storage.set(key,JSON.stringify(four));api=fresh();
  check('Only the untouched raw legacy four-subcategory default migrates to full scope',()=>{
    assert.equal(api.getFlooringScope(plan).find(e=>e.levelNo==='l2_name').selectedValues.length,5);
    assert.equal(JSON.parse(storage.get(key)).version,2);
  });
  storage.clear();storage.set(key,JSON.stringify({version:2,scope:four}));api=fresh();
  check('An explicit current four-subcategory selection is preserved',()=>{
    assert.equal(api.getFlooringScope(plan).find(e=>e.levelNo==='l2_name').selectedValues.length,4);
    assert(api.getFlooringTotals(api.flooringScopeFilters(api.getFlooringScope(plan))).itemCount<72);
  });
  delete global.window;api=fresh();
  check('Non-browser imports and default scope reads do not require storage or DOM globals',()=>{
    assert.equal(api.getFlooringScope(plan).length,3);
    assert.equal(api.getFlooringTotals(api.flooringScopeFilters(api.getFlooringScope(plan))).sales,8400000);
  });
  fs.writeFileSync(path.join(__dirname,'priority-scope-checks.json'),JSON.stringify({kind:'Shared applied-scope source invariants; not browser acceptance',passed:checks.length,checks},null,2)+'\n');
  console.log(`${checks.length} shared applied-scope checks passed.`);
} finally {
  if(originalWindow===undefined)delete global.window;else global.window=originalWindow;
  fs.rmSync(temp,{recursive:true,force:true});
}

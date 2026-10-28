/** Run actual handler → normalizer → hierarchy rollups without mounting browser providers. */
const esbuild = require('esbuild');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'../..');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'assort-priority-rollups-'));
const outfile=path.join(temp,'checks.mjs');
(async()=>{
 try {
  await esbuild.build({absWorkingDir:root,entryPoints:['qa/redesign/priority-rollup-checks.ts'],bundle:true,platform:'node',format:'esm',outfile,
   plugins:[{name:'isolate-pure-metric-normalizer',setup(build){
    // The service imports one pure symbol through a large browser-provider barrel.
    // Resolve that exact barrel import to its original source implementation only.
    build.onResolve({filter:/^@modules\/appConfig$/},()=>({path:path.join(root,'src/modules/appConfig/services/metricCatalogue.ts')}));
   }}],logLevel:'silent'});
  await import(pathToFileURL(outfile).href);
 } finally {fs.rmSync(temp,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});

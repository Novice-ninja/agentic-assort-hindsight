import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {flooringItems} from './index';

const directory='public/demo-flooring';
const colors:Record<string,string>={Espresso:'#70503a',Natural:'#c8aa7a',Honey:'#b88b4f',Driftwood:'#aaa08c',Ash:'#b9ae97',Walnut:'#8a6a4d',Chestnut:'#99704b','Smoke Gray':'#868079'};
const xml=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function random(seed:string){let n=2166136261;for(const c of seed)n=Math.imul(n^c.charCodeAt(0),16777619)>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
function swatch(id:string,name:string,species:string,colour:string,finish:string){
  const rng=random(id),base=colors[colour]??'#ad9876',bamboo=species.includes('Bamboo'),width=bamboo?40:128,count=640/width;
  const planks=Array.from({length:count},(_,p)=>{
    const x=p*width,shift=(rng()-.5)*.12;
    const grain=Array.from({length:bamboo?3:12},(_v,g)=>{
      const gx=x+width*(g+1)/(bamboo?4:13),bend=(rng()-.5)*width*.3;
      return `<path d="M${gx.toFixed(1)} -8 C${(gx+bend).toFixed(1)} 96 ${(gx-bend*.8).toFixed(1)} 164 ${gx.toFixed(1)} 224 S${(gx+bend*.7).toFixed(1)} 360 ${gx.toFixed(1)} 435" fill="none" stroke="${g%3===0?'#fff3d5':'#382311'}" stroke-opacity="${g%3===0?'.18':'.14'}" stroke-width="${g%4===0?'1.5':'.7'}"/>`;
    }).join('');
    const joint=70+Math.floor(rng()*280);
    const knot=bamboo?'':`<g transform="translate(${(x+width*.58).toFixed(1)} ${120+rng()*170})" fill="none" stroke="#352012" stroke-opacity=".17"><ellipse rx="5" ry="19"/><ellipse rx="10" ry="34"/><path d="M-15 -63 Q-27 0 -15 63 M15 -63 Q27 0 15 63"/></g>`;
    const scrape=/Scraped|Distressed/.test(finish)?`<path d="M${x+width*.2} 8 Q${x+width*.5} 200 ${x+width*.25} 415" stroke="#fff5dc" stroke-opacity=".1" stroke-width="${width*.14}" fill="none"/>`:'';
    return `<g><rect x="${x}" width="${width}" height="424" fill="url(#tone)"/><rect x="${x}" width="${width}" height="424" fill="${shift>0?'#fff5db':'#372312'}" opacity="${Math.abs(shift).toFixed(3)}"/>${grain}${knot}${scrape}<path d="M${x} 0 V424 M${x} ${joint} H${x+width}" fill="none" stroke="#3d2b1c" stroke-opacity=".36" stroke-width="2"/><path d="M${x+2} 0 V424" stroke="#fff9e9" stroke-opacity=".15"/></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="424" viewBox="0 0 640 424" role="img"><title>Illustrative flooring swatch: ${xml(name)}</title><desc>Code-generated ${xml(species)} planks in ${xml(colour)}, ${xml(finish)} finish. Synthetic visual aid, not authentic product photography.</desc><defs><linearGradient id="tone"><stop stop-color="${base}"/><stop offset=".28" stop-color="${base}"/><stop offset=".5" stop-color="#e9d7b5" stop-opacity=".45"/><stop offset=".72" stop-color="${base}"/><stop offset="1" stop-color="${base}"/></linearGradient></defs><rect width="640" height="424" fill="${base}"/>${planks}<rect x="1" y="1" width="638" height="422" fill="none" stroke="#362617" stroke-opacity=".2" stroke-width="2"/></svg>`;
}
await mkdir(directory,{recursive:true});
const manifest=[];
for(const item of flooringItems){
  const svg=swatch(item.styleId,item.name,item.species,item.colour,item.finish);
  await writeFile(`${directory}/${item.styleId}.svg`,svg);
  manifest.push({styleId:item.styleId,article:item.article,species:item.species,colour:item.colour,finish:item.finish,url:item.imageUrl,illustrative:true,sha256:createHash('sha256').update(svg).digest('hex')});
}
await writeFile(`${directory}/neutral.svg`,swatch('neutral','Neutral material illustration','Wood','Natural','Smooth'));
await writeFile(`${directory}/manifest.json`,JSON.stringify({label:'Code-native illustrative flooring swatches, not authentic product photography',items:manifest},null,2));
console.log(JSON.stringify({created:manifest.length,neutral:1,directory}));

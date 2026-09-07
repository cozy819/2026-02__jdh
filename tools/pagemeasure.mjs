import { chromium } from 'playwright';
import http from 'http'; import fs from 'fs'; import path from 'path';
const root=process.env.BOOK_ROOT || '.';   // 교과서_배포 루트
const srv=http.createServer((req,res)=>{const p=path.join(root,decodeURIComponent(req.url.split('?')[0]));
 if(!fs.existsSync(p)||fs.statSync(p).isDirectory()){res.writeHead(404);return res.end();}
 const e=path.extname(p);res.writeHead(200,{'Content-Type':e==='.js'?'text/javascript':e==='.css'?'text/css':e==='.png'?'image/png':'text/html; charset=utf-8'});
 res.end(fs.readFileSync(p));});
await new Promise(r=>srv.listen(8904,r));
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox','--disable-background-networking','--disable-component-update','--no-first-run']});
// A4 인쇄 영역: 210-30=180mm 폭, 297-32=265mm 높이
const MM=96/25.4, Wpx=Math.round(180*MM), Hpx=Math.round(265*MM);
const ctx=await b.newContext({viewport:{width:Wpx,height:Hpx}});
await ctx.route('**://**',r=>r.request().url().startsWith('http://localhost:8904')?r.continue():r.abort());
console.log(`A4 인쇄 영역 ${Wpx} × ${Hpx} px\n`);
for (const f of process.argv.slice(2)) {
  const pg=await ctx.newPage();
  await pg.goto(`http://localhost:8904/${f}`,{waitUntil:'load'});
  await pg.emulateMedia({media:'print'});
  await pg.waitForTimeout(800);
  const rows=await pg.evaluate((H)=>[...document.querySelectorAll('.page')].map((p,i)=>{
    const kick=p.querySelector('.kick .ko')?.textContent||'';
    const t=p.querySelector('h2.title .ko')?.textContent||p.querySelector('.ctitle')?.textContent||'(표지)';
    return {i:i+1, id:p.id||'-', h:Math.round(p.scrollHeight), over:p.scrollHeight>H, kick, t:t.slice(0,28)};
  }), Hpx);
  console.log(`── ${f}`);
  for(const r of rows) console.log(`  ${String(r.i).padStart(2)} ${r.id.padEnd(5)} ${String(r.h).padStart(5)}px ${r.over?'❌ 넘침':'  '} ${r.kick} ${r.t}`);
  console.log('');
  await pg.close();
}
await b.close(); srv.close();

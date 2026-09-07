import { chromium } from 'playwright';
import http from 'http'; import fs from 'fs'; import path from 'path';
import { execSync } from 'child_process';
const root=process.env.BOOK_ROOT || '.';   // 교과서_배포 루트
const srv=http.createServer((req,res)=>{const p=path.join(root,decodeURIComponent(req.url.split('?')[0]));
 if(!fs.existsSync(p)||fs.statSync(p).isDirectory()){res.writeHead(404);return res.end();}
 const e=path.extname(p);res.writeHead(200,{'Content-Type':e==='.js'?'text/javascript':e==='.css'?'text/css':e==='.png'?'image/png':'text/html; charset=utf-8'});
 res.end(fs.readFileSync(p));});
await new Promise(r=>srv.listen(8903,r));
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox','--disable-background-networking','--disable-component-update','--no-first-run']});
const ctx=await b.newContext();
await ctx.route('**://**',r=>r.request().url().startsWith('http://localhost:8903')?r.continue():r.abort());
for (const f of process.argv.slice(2)) {
  const pg=await ctx.newPage();
  await pg.goto(`http://localhost:8903/${f}`,{waitUntil:'load'});
  await pg.waitForTimeout(900);
  const info=await pg.evaluate(()=>{
    const ps=[...document.querySelectorAll('.page')];
    return {n:ps.length, ids:ps.map(p=>p.id||'(no id)')};
  });
  const out=`/tmp/${f.replace(/[\/]/g,'_')}.pdf`;
  await pg.pdf({path:out, format:'A4', printBackground:true, margin:{top:'16mm',bottom:'16mm',left:'15mm',right:'15mm'}});
  const pdfPages=parseInt(execSync(`pdfinfo ${out} | awk '/^Pages/{print $2}'`).toString().trim());
  console.log(`${f}  .page=${info.n}  인쇄장수=${pdfPages}  ${info.n===pdfPages?'✅ 일치':'❌ '+(pdfPages-info.n)+'장 초과'}`);
  await pg.close();
}
await b.close(); srv.close();

import { createRequire } from 'module';
import os from 'os';
import http from 'http'; import fs from 'fs'; import path from 'path';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch {
  const mods=process.env.CODEX_NODE_MODULES||path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
  ({ chromium } = createRequire(path.join(mods,'package.json'))('playwright'));
}
import { execSync } from 'child_process';
const root=process.env.BOOK_ROOT || '.';   // 교과서_배포 루트
const srv=http.createServer((req,res)=>{const p=path.join(root,decodeURIComponent(req.url.split('?')[0]));
 if(!fs.existsSync(p)||fs.statSync(p).isDirectory()){res.writeHead(404);return res.end();}
 const e=path.extname(p);res.writeHead(200,{'Content-Type':e==='.js'?'text/javascript':e==='.css'?'text/css':e==='.png'?'image/png':'text/html; charset=utf-8'});
 res.end(fs.readFileSync(p));});
await new Promise((resolve,reject)=>{srv.once('error',reject);srv.listen(0,'127.0.0.1',resolve);});
const port=srv.address().port;
const chromeCandidates=[
  process.env.CHROME_PATH,
  chromium.executablePath?.(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
].filter(Boolean);
const chromePath=chromeCandidates.find(p=>fs.existsSync(p));
if(!chromePath) throw new Error('Chrome/Chromium을 찾지 못했습니다. CHROME_PATH에 실행 파일 경로를 지정하세요.');
const b=await chromium.launch({executablePath:chromePath,args:['--no-sandbox','--disable-background-networking','--disable-component-update','--no-first-run']});
const ctx=await b.newContext();
const origin=`http://127.0.0.1:${port}`;
await ctx.route('**://**',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
const args=process.argv.slice(2);
const targets=args.length?args:fs.readdirSync(root)
  .filter(d=>/^\d\d$/.test(d)&&fs.existsSync(path.join(root,d,'textbook')))
  .flatMap(d=>fs.readdirSync(path.join(root,d,'textbook')).filter(f=>f.endsWith('.html')).map(f=>`${d}/textbook/${f}`));
let failed=false;
for (const f of targets) {
  const pg=await ctx.newPage();
  await pg.goto(`${origin}/${f}`,{waitUntil:'load'});
  if(process.env.BOOK_LANG==='zh') await pg.evaluate(()=>{
    document.documentElement.classList.remove('lang-ko');
    document.documentElement.classList.add('lang-zh');
    document.body.classList.remove('lang-ko');
    document.body.classList.add('lang-zh');
  });
  await pg.waitForTimeout(900);
  const info=await pg.evaluate(()=>{
    const ps=[...document.querySelectorAll('.page')];
    return {n:ps.length, ids:ps.map(p=>p.id||'(no id)')};
  });
  const out=`/tmp/${f.replace(/[\/]/g,'_')}.pdf`;
  await pg.pdf({path:out, format:'A4', printBackground:true, margin:{top:'16mm',bottom:'16mm',left:'15mm',right:'15mm'}});
  const pdfPages=parseInt(execSync(`pdfinfo ${out} | awk '/^Pages/{print $2}'`).toString().trim());
  if(info.n!==pdfPages) failed=true;
  console.log(`${f}  .page=${info.n}  인쇄장수=${pdfPages}  ${info.n===pdfPages?'✅ 일치':'❌ '+(pdfPages-info.n)+'장 초과'}`);
  await pg.close();
}
await b.close(); srv.close();
if(failed) process.exitCode=1;

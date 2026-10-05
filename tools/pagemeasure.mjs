import { createRequire } from 'module';
import os from 'os';
import { fileURLToPath } from 'url';
import http from 'http'; import fs from 'fs'; import path from 'path';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch (firstError) {
  const scriptDir=path.dirname(fileURLToPath(import.meta.url));
  const candidates=[
    process.env.HARNESS_NODE_MODULES,
    process.env.CODEX_NODE_MODULES,
    path.resolve(scriptDir,'../../../harness/node_modules'),
    path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'),
  ].filter(Boolean);
  const mods=candidates.find(p=>fs.existsSync(path.join(p,'playwright','package.json')));
  if(!mods) throw new Error('Playwright를 찾지 못했습니다. 프로젝트 루트에서 npm install --prefix harness 를 실행하세요.',{cause:firstError});
  ({ chromium } = createRequire(path.join(mods,'package.json'))('playwright'));
}
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
// A4 인쇄 영역: 210-30=180mm 폭, 297-32=265mm 높이
const MM=96/25.4, Wpx=Math.round(180*MM), Hpx=Math.round(265*MM);
const ctx=await b.newContext({viewport:{width:Wpx,height:Hpx}});
const origin=`http://127.0.0.1:${port}`;
await ctx.route('**://**',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
console.log(`A4 인쇄 영역 ${Wpx} × ${Hpx} px\n`);
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
  await pg.emulateMedia({media:'print'});
  await pg.waitForTimeout(800);
  const rows=await pg.evaluate((H)=>[...document.querySelectorAll('.page')].map((p,i)=>{
    const kick=p.querySelector('.kick .ko')?.textContent||'';
    const t=p.querySelector('h2.title .ko')?.textContent||p.querySelector('.ctitle')?.textContent||'(표지)';
    return {i:i+1, id:p.id||'-', h:Math.round(p.scrollHeight), over:p.scrollHeight>H, tight:p.scrollHeight>950, kick, t:t.slice(0,28)};
  }), Hpx);
  console.log(`── ${f}`);
  for(const r of rows) {
    if(r.over) failed=true;
    const state=r.over?'❌ 넘침':r.tight?'⚠️ 여유 적음':'  ';
    console.log(`  ${String(r.i).padStart(2)} ${r.id.padEnd(5)} ${String(r.h).padStart(5)}px ${state} ${r.kick} ${r.t}`);
  }
  console.log('');
  await pg.close();
}
await b.close(); srv.close();
if(failed) process.exitCode=1;

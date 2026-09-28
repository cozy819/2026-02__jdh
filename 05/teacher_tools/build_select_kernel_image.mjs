import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const root = path.resolve(import.meta.dirname, "../..");
const output = path.join(root, "assets/img/05-1-01-select-kernel.png");

function windowFrame(x, label, mode) {
  const picker = mode === "found" ? `
    <rect x="${x + 250}" y="330" width="470" height="210" rx="7" fill="#252526" stroke="#555B63" stroke-width="2"/>
    <text class="ui white s b" x="${x + 272}" y="365">Select Python Environment</text>
    <rect x="${x + 266}" y="386" width="438" height="86" rx="5" fill="#303238" stroke="#FF5C00" stroke-width="3"/>
    <text class="ui white m b" x="${x + 288}" y="420">.venv (Python 3.14)</text>
    <text class="mono muted s" x="${x + 288}" y="450">05\\.venv\\Scripts\\python.exe</text>
    <text class="ui white s" x="${x + 288}" y="512">Jupyter Kernel...</text>` : `
    <rect x="${x + 250}" y="310" width="470" height="178" rx="7" fill="#252526" stroke="#555B63" stroke-width="2"/>
    <text class="ui white s b" x="${x + 272}" y="345">Select Python Environment</text>
    <rect x="${x + 266}" y="370" width="438" height="58" rx="5" fill="#303238" stroke="#FF5C00" stroke-width="3"/>
    <text class="ui white m b" x="${x + 288}" y="407">+ Create Python Environment</text>
    <rect x="${x + 212}" y="512" width="535" height="240" rx="8" fill="#F7F8F9" stroke="#AEB4BB" stroke-width="2"/>
    <rect x="${x + 212}" y="512" width="535" height="42" rx="8" fill="#E9EBEE"/>
    <text class="ui s b" x="${x + 232}" y="540">Python 경로 선택</text>
    <rect x="${x + 230}" y="573" width="500" height="35" rx="5" fill="#FFFFFF" stroke="#D4D8DD"/>
    <text class="mono ink s" x="${x + 246}" y="597">05\\.venv\\Scripts</text>
    <text class="ui ink s" x="${x + 242}" y="646">이름</text><text class="ui muted s" x="${x + 570}" y="646">유형</text>
    <rect x="${x + 232}" y="661" width="495" height="48" rx="4" fill="#E5F2F4" stroke="#0B8995"/>
    <text class="mono ink m b" x="${x + 254}" y="692">python.exe</text><text class="ui ink s" x="${x + 570}" y="692">응용 프로그램</text>`;

  return `
  <text class="ui ink m b" x="${x + 8}" y="52">${label}</text>
  <rect x="${x}" y="74" width="760" height="790" rx="10" fill="#1E1E1E" stroke="#1B1D21" stroke-width="3"/>
  <rect x="${x}" y="74" width="760" height="42" rx="10" fill="#181A1F"/>
  <rect x="${x}" y="104" width="760" height="12" fill="#181A1F"/>
  <text class="ui white s" x="${x + 18}" y="101">05_assessment1.ipynb — Visual Studio Code</text>
  <path d="M${x + 665} 95h16" stroke="#fff" stroke-width="2"/><rect x="${x + 697}" y="86" width="16" height="16" fill="none" stroke="#fff" stroke-width="2"/><path d="M${x + 730} 86l16 16m0-16l-16 16" stroke="#fff" stroke-width="2"/>
  <rect x="${x}" y="116" width="190" height="748" fill="#252526"/>
  <text class="ui white s b" x="${x + 18}" y="151">EXPLORER</text>
  <text class="ui white s b" x="${x + 18}" y="187">▾ 05</text>
  <text class="ui white s" x="${x + 42}" y="220">▸ .venv</text>
  <text class="ui white s" x="${x + 42}" y="253">▾ notebooks</text>
  <text class="ui white s" x="${x + 60}" y="286">05_assessment1.ipynb</text>
  <text class="ui white s" x="${x + 42}" y="319">▸ data</text>
  <text class="ui white s" x="${x + 42}" y="352">pyproject.toml</text>
  <text class="ui white s" x="${x + 42}" y="385">uv.lock</text>
  <rect x="${x + 190}" y="116" width="570" height="48" fill="#252526"/>
  <text class="ui white s" x="${x + 212}" y="146">05_assessment1.ipynb</text>
  <rect x="${x + 564}" y="125" width="177" height="30" rx="15" fill="#1E1E1E" stroke="#FF5C00" stroke-width="2"/>
  <text class="ui white s b" x="${x + 582}" y="147">Select Kernel</text>
  <rect x="${x + 222}" y="190" width="500" height="116" rx="7" fill="#252526" stroke="#555B63" stroke-width="2"/>
  <text class="ui white s b" x="${x + 244}" y="225">Select Kernel</text>
  <rect x="${x + 238}" y="244" width="468" height="45" rx="4" fill="#303238"/>
  <text class="ui white m b" x="${x + 260}" y="274">Python Environments...</text>
  ${picker}
  <rect x="${x + 215}" y="786" width="500" height="42" rx="4" fill="#252526" stroke="#555B63"/>
  <text class="mono white s" x="${x + 236}" y="813">print("kernel ready")</text>`;
}

const svg = String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#F1F2F4"/>
  <style>
    .ui { font-family:'IBM Plex Sans KR','Segoe UI',sans-serif }
    .mono { font-family:'IBM Plex Mono','Consolas',monospace }
    .s { font-size:17px } .m { font-size:20px } .b { font-weight:700 }
    .white { fill:#FFFFFF } .ink { fill:#1B1D21 } .muted { fill:#AEB4BB }
  </style>
  ${windowFrame(28, "Python Environments 목록에 .venv가 보이면", "found")}
  ${windowFrame(812, "Python Environments 목록에 .venv가 안 보이면", "missing")}
</svg>`;

await fs.mkdir(path.dirname(output), { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(output);
console.log(output);

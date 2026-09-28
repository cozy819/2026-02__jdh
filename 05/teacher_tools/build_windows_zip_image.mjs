import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const root = path.resolve(import.meta.dirname, "../..");
const output = path.join(root, "assets/img/05-2-01-windows-zip.png");

const svg = String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="686" viewBox="0 0 1600 686">
  <rect width="1600" height="686" fill="#F1F2F4"/>
  <style>
    .ui { font-family:'IBM Plex Sans KR','Segoe UI',sans-serif; fill:#1B1D21 }
    .mono { font-family:'IBM Plex Mono','Consolas',monospace; fill:#1B1D21 }
    .s { font-size:17px } .m { font-size:20px } .b { font-weight:700 }
    .muted { fill:#69707A } .white { fill:#fff }
  </style>
  <rect x="24" y="22" width="1552" height="642" rx="11" fill="#FFFFFF" stroke="#AEB4BB" stroke-width="2"/>
  <rect x="24" y="22" width="1552" height="46" rx="11" fill="#E9EBEE"/>
  <rect x="24" y="56" width="1552" height="12" fill="#E9EBEE"/>
  <path d="M37 45h20l8 8h44v-9H67l-8-8H37z" fill="#FFD45C" stroke="#B99A2C"/>
  <text class="ui s b" x="126" y="52">파일 탐색기</text>
  <path d="M1458 46h20" stroke="#1B1D21" stroke-width="2"/><rect x="1491" y="36" width="18" height="18" fill="none" stroke="#1B1D21" stroke-width="2"/><path d="M1532 37l18 18m0-18l-18 18" stroke="#1B1D21" stroke-width="2"/>

  <rect x="24" y="68" width="1552" height="58" fill="#F7F8F9"/>
  <text class="ui m" x="50" y="103">←</text><text class="ui m muted" x="88" y="103">→</text><text class="ui m" x="128" y="103">↑</text>
  <rect x="177" y="79" width="930" height="36" rx="8" fill="#FFFFFF" stroke="#D4D8DD"/>
  <text class="ui s muted" x="198" y="103">내 PC  ›  다운로드</text>
  <rect x="1125" y="79" width="420" height="36" rx="8" fill="#FFFFFF" stroke="#D4D8DD"/>
  <text class="ui s muted" x="1150" y="103">다운로드 검색</text>

  <rect x="24" y="126" width="1552" height="54" fill="#FFFFFF"/>
  <text class="ui m" x="55" y="160">+  새로 만들기</text>
  <line x1="220" y1="139" x2="220" y2="168" stroke="#D4D8DD"/>
  <text class="ui m" x="250" y="160">✂</text><text class="ui m" x="296" y="160">파일 이름 바꾸기</text>
  <text class="ui m muted" x="500" y="160">⊟</text><text class="ui m muted" x="548" y="160">⋯</text>
  <line x1="24" y1="180" x2="1576" y2="180" stroke="#D8DCE0"/>

  <rect x="24" y="181" width="245" height="483" fill="#F7F8F9"/>
  <text class="ui s b" x="55" y="224">★  홈</text>
  <text class="ui s" x="55" y="267">🖼  갤러리</text>
  <text class="ui s" x="55" y="310">🖥  바탕 화면</text>
  <text class="ui s" x="55" y="353">📄  문서</text>
  <rect x="39" y="373" width="214" height="39" rx="6" fill="#E5F2F4"/>
  <text class="ui s b" x="55" y="399">⬇  다운로드</text>
  <text class="ui s" x="55" y="445">📁  사진</text>
  <text class="ui s" x="55" y="488">🎵  음악</text>
  <text class="ui s" x="55" y="531">🎬  비디오</text>
  <text class="ui s" x="55" y="582">🖥  내 PC</text>

  <rect x="269" y="181" width="1307" height="42" fill="#FFFFFF"/>
  <text class="ui s muted" x="320" y="207">이름</text>
  <text class="ui s muted" x="900" y="207">수정한 날짜</text>
  <text class="ui s muted" x="1140" y="207">유형</text>
  <text class="ui s muted" x="1370" y="207">크기</text>
  <line x1="269" y1="223" x2="1576" y2="223" stroke="#E0E3E7"/>

  <rect x="286" y="239" width="1060" height="58" rx="5" fill="#E5F2F4" stroke="#0B8995" stroke-width="2"/>
  <path d="M309 260h28l10 10h43v22h-81z" fill="#FFD45C" stroke="#B99A2C"/>
  <text class="ui m b" x="410" y="276">05_assessment1_이름</text>
  <text class="ui s" x="900" y="276">2026-09-28  오후 11:42</text>
  <text class="ui s" x="1140" y="276">파일 폴더</text>
  <text class="ui s" x="320" y="340">05_student_files.zip</text>
  <text class="ui s" x="900" y="340">2026-09-28  오후 10:10</text>
  <text class="ui s" x="1140" y="340">ZIP 파일</text>
  <text class="ui s" x="1370" y="340">338KB</text>

  <rect x="760" y="286" width="410" height="340" rx="10" fill="#FFFFFF" stroke="#AEB4BB" stroke-width="2"/>
  <text class="ui m" x="790" y="331">열기</text>
  <text class="ui m" x="790" y="374">새 창에서 열기</text>
  <line x1="780" y1="399" x2="1150" y2="399" stroke="#E0E3E7"/>
  <text class="ui m" x="790" y="437">잘라내기</text>
  <text class="ui m" x="790" y="480">복사</text>
  <text class="ui m" x="790" y="523">이름 바꾸기</text>
  <line x1="780" y1="548" x2="1150" y2="548" stroke="#E0E3E7"/>
  <rect x="778" y="560" width="374" height="49" rx="6" fill="#FFF1E8" stroke="#FF5C00" stroke-width="3"/>
  <text class="ui m b" x="802" y="592">ZIP 파일로 압축</text>
  <path d="M1100 578h24v18h-24zm4-8h16v8h-16z" fill="#FF5C00"/>

  <text class="ui s muted" x="300" y="642">1개 항목 선택됨</text>
</svg>`;

await fs.mkdir(path.dirname(output), { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(output);
console.log(output);

// 제출용 ZIP을 만든다 — npm run pack
// node_modules · .next · .env 는 빼고, 이 폴더 바로 바깥에 submit.zip 을 만든다.
// Windows 10 이상에 들어 있는 tar 명령을 쓴다. (선생님이 정해 둔 파일 · 고치지 않는다)
import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const here = process.cwd();
const folder = path.basename(here);
const out = path.join(here, "..", "submit.zip");
if (fs.existsSync(out)) fs.rmSync(out);

const r = spawnSync("tar", [
  "-a", "-c", "-f", out,
  "--exclude", `${folder}/node_modules`,
  "--exclude", `${folder}/.next`,
  "--exclude", `${folder}/.env*`,
  folder,
], { cwd: path.join(here, ".."), stdio: "inherit" });

if (r.status !== 0) {
  console.error("ZIP을 만들지 못했습니다. 화면을 캡처해 선생님께 보여 주세요.");
  process.exit(1);
}
const kb = Math.round(fs.statSync(out).size / 1024);
console.log(`만들었습니다: ${out} (${kb}KB)`);
console.log("이 파일의 이름을 안내받은 제출 이름으로 바꿔서 제출합니다.");

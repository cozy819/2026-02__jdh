import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sample = path.join(root, "sample");
const dataDir = path.join(sample, "data");
const notebookDir = path.join(sample, "notebooks");
const evidenceDir = path.join(sample, "evidence");
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(notebookDir, { recursive: true });
fs.mkdirSync(evidenceDir, { recursive: true });

function noise(a, b, c) {
  return ((a * 17 + b * 31 + c * 13 + 7) % 9) - 4;
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const facilities = ["Library", "Gym", "Computer_Room", "Science_Lab", "Art_Room", "Music_Room"];
const slots = Array.from({ length: 12 }, (_, i) => {
  const mins = 8 * 60 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});
const facilityBase = [18, 24, 21, 13, 11, 15];
const facilityRows = [["date", "weekday", "time_slot", "facility", "visitors"]];
let d = new Date(Date.UTC(2026, 2, 2));
let schoolDay = 0;
while (schoolDay < 180) {
  const dow = d.getUTCDay();
  if (dow >= 1 && dow <= 5) {
    for (let fi = 0; fi < facilities.length; fi++) {
      for (let si = 0; si < slots.length; si++) {
        const lunch = si >= 6 && si <= 9 ? 11 : si >= 3 ? 5 : 0;
        const friday = dow === 5 ? 4 : 0;
        const visitors = Math.max(0, facilityBase[fi] + lunch + friday + noise(schoolDay, fi, si));
        facilityRows.push([
          d.toISOString().slice(0, 10), weekdays[dow - 1], slots[si], facilities[fi], visitors,
        ]);
      }
    }
    schoolDay++;
  }
  d.setUTCDate(d.getUTCDate() + 1);
}

function writeCsv(name, rows) {
  const body = rows.map(row => row.join(",")).join("\r\n") + "\r\n";
  fs.writeFileSync(path.join(dataDir, name), "\ufeff" + body, "utf8");
}

writeCsv("05-data-1-school-facility-usage.csv", facilityRows);

const md = (source) => ({ cell_type: "markdown", metadata: {}, source: source.split("\n").map((s, i, a) => s + (i < a.length - 1 ? "\n" : "")) });
const code = () => ({ cell_type: "code", execution_count: null, metadata: {}, outputs: [], source: [] });
const notebook = {
  cells: [
    md("# 수행평가 1 · AI 활용 데이터 시각화\n\n- 사용한 CSV 파일: `05-data-1-school-facility-usage.csv`"),
    md("## 1. 자료 파악"),
    md("## 2. 그래프 선택과 계획 확인"),
    md("## 3. 실행"),
    code(),
    md("## 4. 결과 검토와 해석"),
  ],
  metadata: {
    kernelspec: { display_name: ".venv (Python 3)", language: "python", name: "python3" },
    language_info: { name: "python", version: "3.14" },
  },
  nbformat: 4,
  nbformat_minor: 5,
};
fs.writeFileSync(path.join(notebookDir, "05_assessment1.ipynb"), JSON.stringify(notebook, null, 2) + "\n", "utf8");

const markdownText = (lines) => lines.join("\n") + "\n";
fs.writeFileSync(path.join(sample, "README.md"), markdownText([
  "# 수행평가 1 · AI 활용 데이터 시각화",
  "",
  "## 프로젝트 소개",
  "",
  "이 프로젝트는 학교 시설 이용 기록이 담긴 CSV를 읽고, AI와 함께 데이터를 살펴본 뒤 알맞은 그래프로 표현하는 수행평가 자료입니다. 자료를 파악한 과정과 판단, 실행한 그래프를 Notebook에 남깁니다.",
  "",
  "## 폴더 구성",
  "",
  "```text",
  "05/",
  "├─ README.md",
  "├─ pyproject.toml",
  "├─ uv.lock",
  "├─ notebooks/",
  "│  └─ 05_assessment1.ipynb",
  "├─ data/",
  "│  └─ 05-data-1-school-facility-usage.csv",
  "└─ evidence/                 ← 이번 수행평가의 증거 자료",
  "   └─ opencode-session-1.json",
  "```",
  "",
  "- `notebooks`: 수행평가의 판단 과정, 실행 코드와 그래프를 남기는 곳",
  "- `data`: 그래프의 바탕이 되는 원본 CSV가 있는 곳",
  "- `evidence`: 이번 수행평가에서 AI 활용 과정을 확인하기 위한 JSON을 넣는 곳",
  "- `pyproject.toml`: 프로젝트가 요구하는 Python 버전과 라이브러리를 적은 파일",
  "- `uv.lock`: 이 프로젝트에서 실제로 사용한 라이브러리 버전을 기록한 파일",
  "",
  "`evidence` 폴더와 OpenCode JSON은 보통 프로젝트를 공유할 때 넣는 파일이 아닙니다. 이번 수행평가에서 AI를 어떻게 활용했는지 확인하기 위해서만 추가합니다.",
  "",
  "## 실행 환경",
  "",
  "- Windows용 VS Code와 Jupyter 확장",
  "- uv",
  "- OpenCode",
  "- Python과 라이브러리 정보가 담긴 `pyproject.toml`",
  "- 이번 프로젝트에서 사용한 정확한 버전이 담긴 `uv.lock`",
  "",
  "`uv.lock`이 없어도 `pyproject.toml`을 기준으로 환경을 만들 수 있지만 라이브러리 버전이 달라질 수 있습니다. 이번 수행평가에서는 같은 환경을 다시 만들 수 있도록 `uv.lock`도 함께 제출합니다.",
  "",
  "## 환경 준비와 실행",
  "",
  "1. 이 `05` 폴더 전체를 VS Code로 엽니다.",
  "2. 터미널의 현재 위치가 `05` 폴더인지 확인합니다.",
  "3. 직접 `uv sync`를 실행하거나 아래 요청을 OpenCode에 보냅니다.",
  "4. `notebooks/05_assessment1.ipynb`를 엽니다.",
  "5. 오른쪽 위의 `Select Kernel`에서 `05` 폴더의 `.venv`를 사용하는 커널을 선택합니다.",
  "",
  "### OpenCode에 환경 준비를 맡길 때",
  "",
  "```text",
  "이 프로젝트는 uv를 사용해.",
  "pip나 pip install은 사용하지 말고, 현재 05 폴더의 pyproject.toml과 uv.lock을 확인한 뒤 uv sync를 실행해 줘.",
  "끝나면 어떤 파일을 확인했고 어떤 작업을 했는지 알려 줘.",
  "```",
  "",
  "## Notebook 커널 선택",
  "",
  "커널 이름은 `.venv`, `jangdaehyun-assessment1`, `.venv/bin/python` 같은 실행 경로로 보일 수 있습니다. 이름보다 `05` 폴더 안의 `.venv`를 가리키는지 확인합니다.",
  "",
  "### 목록에 바로 보일 때",
  "",
  "1. Notebook 오른쪽 위의 `Select Kernel`을 누릅니다.",
  "2. `Python Environments`를 엽니다.",
  "3. 경로가 `05\\.venv\\Scripts\\python.exe`인 항목을 고릅니다.",
  "",
  "### 목록에 `.venv`가 안 보일 때",
  "",
  "1. Notebook 오른쪽 위의 `Select Kernel`을 누릅니다.",
  "2. `Python Environments...`를 엽니다.",
  "3. `Create Python Environment`를 누릅니다.",
  "4. `05\\.venv\\Scripts\\python.exe` 경로를 선택합니다.",
  "",
  "선택한 뒤에는 표시 이름보다 선택한 Python의 경로가 `05\\.venv\\Scripts\\python.exe`인지 확인합니다.",
  "",
  "## 수행평가 순서",
  "",
  "그래프는 알고 있는 내용을 한눈에 보여 주기 위해 그리기도 하고, 많은 행을 표만으로 봤을 때 놓치기 쉬운 패턴을 찾기 위해 그리기도 합니다.",
  "",
  "1. 자료 파악",
  "2. 그래프 선택과 계획 확인",
  "3. 실행",
  "4. 결과 검토와 해석",
  "",
  "## 평가용 AI 대화 기록 내보내기",
  "",
  "OpenCode 대화 기록은 프로젝트 실행에 필요한 파일이 아니라 이번 수행평가의 증거 자료입니다. 수행평가와 관련된 대화가 여러 개라면 빠짐없이 JSON으로 내보냅니다.",
  "",
  "아래 요청을 OpenCode에 보냅니다.",
  "",
  "```text",
  "이번 수행평가와 관련된 OpenCode session을 모두 확인해서 evidence 폴더에 JSON으로 내보내 줘.",
  "각 session을 opencode-session-1.json, opencode-session-2.json처럼 번호를 붙여 저장해 줘.",
  "각 파일이 비어 있지 않은지도 확인하고, 저장한 파일을 알려 줘.",
  "```",
  "",
  "`evidence` 폴더를 열어 관련 대화 수만큼 JSON 파일이 생겼고 각 파일에 내용이 들어 있는지 확인합니다.",
  "",
  "## 제출",
  "",
  "1. 모든 Notebook 셀을 처음부터 다시 실행합니다.",
  "2. 실행 결과와 그래프가 화면에 나온 뒤 `Ctrl+S`로 저장합니다.",
  "3. Notebook을 다시 열어 그래프가 남아 있는지 확인합니다.",
  "4. 파일 탐색기에서 `05` 폴더를 복사해 같은 위치에 붙여넣습니다.",
  "5. 복사한 폴더 이름을 `05_assessment1_이름`으로 바꿉니다.",
  "6. 제출용 사본에서 `.venv`, `__pycache__`, 캐시·임시 파일만 지웁니다.",
  "7. 사본 폴더를 마우스 오른쪽 단추로 누르고 `더 많은 옵션 표시 → 보내기 → 압축(ZIP) 폴더`를 고릅니다.",
  "8. Google 계정으로 로그인한 뒤 선생님이 알려 준 Google Form에 `05_assessment1_이름.zip` 하나를 올립니다.",
]), "utf8");
console.log(`data1=${facilityRows.length - 1}`);
console.log("notebook=notebooks/05_assessment1.ipynb");

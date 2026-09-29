import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "textbook");

const bi = (ko, zh) => `<span class="ko">${ko}</span><span class="zh">${zh}</span>`;
const sectionLabelsZh = new Map([
  ["1. 수업 자료 준비", "1. 课堂资料准备"],
  ["2. 지난 시간과 연결", "2. 与上节课衔接"],
  ["3. 확인하는 것", "3. 考核中要确认的内容"],
  ["4. 개발자가 코드를 나누는 방법", "4. 开发者如何分享代码"],
  ["5. 프로젝트 공유의 기준", "5. 项目分享标准"],
  ["6. 작업과 원본 공유", "6. 分享工作内容和原始数据"],
  ["7. 환경 정보 공유", "7. 分享环境信息"],
  ["8. 다시 만들 파일", "8. 可以重建的文件"],
  ["9. 공유할 파일 한눈에 보기", "9. 分享文件一览"],
  ["10. 수업 파일 준비", "10. 准备课堂文件"],
  ["11. Notebook 커널 선택", "11. 选择 Notebook 内核"],
  ["12. 수행평가 데이터", "12. 实践考核数据"],
  ["13. AI에게 일을 나누어 주기", "13. 分步向 AI 交代任务"],
  ["14. 큰 자료를 확인하는 법", "14. 如何查看大型数据"],
  ["15. AI 사용 기록", "15. AI 使用记录"],
  ["16. 다음 차시 전 확인", "16. 下节课前检查"],
  ["1. 시작 전 점검", "1. 开始前检查"],
  ["2. 수행평가에서 반드시 남길 것", "2. 实践考核中必须保留的内容"],
  ["3. 수행이 끝난 뒤 점검", "3. 完成后检查"],
  ["4. AI 대화 기록 저장", "4. 保存 AI 对话记录"],
  ["5. 제출용 ZIP 만들기", "5. 制作提交用 ZIP"],
  ["6. Google Form 제출", "6. 提交 Google Form"],
]);
const page = (id, no, koTitle, zhTitle, body, badge = "") => `
<section class="page${id.startsWith("a11") ? " print-kernel-page" : ""}" id="${id}">
  <div class="kick">${bi(no, sectionLabelsZh.get(no) || no.replace(/\s.*$/, ""))}<b>${id.startsWith("a") ? "5-1" : "5-2"}</b></div>
  <h2 class="title">${bi(koTitle, zhTitle)}${badge ? ` <span class="badge ${badge === "실습" ? "lab" : "core"}">${bi(badge, badge === "실습" ? "实操" : "核心")}</span>` : ""}</h2>
  ${body}
</section>`;
const lead = (ko, zh) => `<p class="lead">${bi(ko, zh)}</p>`;
const p = (ko, zh) => `<p>${bi(ko, zh)}</p>`;
const note = (ko, zh, tone = "") => `<div class="note ${tone}"><p>${bi(ko, zh)}</p></div>`;
const bullets = (items) => `<ul class="blist">${items.map(([ko, zh]) => `<li>${bi(ko, zh)}</li>`).join("")}</ul>`;
const steps = (items) => `<div class="steps"><ol>${items.map(([ko, zh]) => `<li>${bi(ko, zh)}</li>`).join("")}</ol></div>`;
const prompt = (labelKo, labelZh, ko, zh) => `<div class="code"><div class="chd"><span class="fn">${bi(labelKo, labelZh)}</span><button class="cp" onclick="copyCode(this)">${bi("복사", "复制")}</button></div><pre class="ko blk">${ko}</pre><pre class="zh blk">${zh}</pre></div>`;
const tree = (text) => `<div class="code"><div class="chd"><span class="fn">${bi("폴더 구성", "文件夹结构")}</span></div><pre>${text}</pre></div>`;

function opener(lesson, koTitle, zhTitle, koSub, zhSub, prevKo, prevZh, nextKo, nextZh) {
  return `<section class="page opener" id="opener"><div class="onum">${bi(`5회 · ${lesson === "5-1" ? "첫째" : "둘째"} 차시`, `第 5 次课 · 第 ${lesson === "5-1" ? "1" : "2"} 课时`)}</div><h1>${bi(koTitle, zhTitle)}</h1><div class="osub">${bi(koSub, zhSub)}</div><div class="abar"></div><div class="ometa">${bi(`<b>이전 차시</b> · ${prevKo}<br/><b>다음 차시</b> · ${nextKo}`, `<b>上一课时</b> · ${prevZh}<br/><b>下一课时</b> · ${nextZh}`)}</div></section>`;
}

const pages51 = [
  opener("5-1", "수행평가 1 안내<br/><span style=\"font-size:.62em;color:var(--muted);font-weight:700\">AI와 함께 만든 과정을 프로젝트로 남기기</span>", "实践考核 1 说明<br/><span style=\"font-size:.62em;color:var(--muted);font-weight:700\">把与 AI 共同完成的过程保存为项目</span>", "큰 데이터를 읽고 그래프로 보여 주며, AI에게 일을 나누어 요청하고 결과를 검토합니다.", "读取大型数据并用图表展示，同时学会向 AI 分步提交任务、检查结果。", "4-2. pandas로 표 데이터를 쉽게 사용하기", "4-2. 用 pandas 轻松处理表格数据", "5-2. 수행평가 1 실시·제출", "5-2. 实践考核 1 实施与提交"),
  page("a1", "1. 수업 자료 준비", "자료를 내려받고 수행평가 준비를 시작한다", "下载资料，开始准备实践考核",
    lead("오늘부터 수행평가를 준비합니다. 아래의 <b>05 학생용 자료</b>를 내려받은 뒤 압축을 푸세요. 안에 있는 <code>05</code> 폴더를 지난 시간부터 사용한 내 프로젝트 폴더에 넣으면 준비가 끝납니다.", "从今天开始准备实践考核。请先下载下方的<b>05 学生用资料</b>并解压。然后把其中的 <code>05</code> 文件夹放进上节课一直使用的个人项目文件夹，课前准备就完成了。") +
    `<div class="folder-download-row"><a class="download-cta" href="../../downloads/05_student_files.zip" download><span class="download-icon" aria-hidden="true">↓</span><span><b class="ko">05 학생용 자료 내려받기</b><b class="zh">下载 05 学生用资料</b><small>05_student_files.zip</small></span></a><div class="download-note">${bi("압축을 풀면 <code>05</code> 폴더가 나옵니다. <code>JDH_VibeCoding_자기이름</code> 안에 넣습니다.", "解压后会看到 <code>05</code> 文件夹。请把它放进 <code class=\"keep-ko\">JDH_VibeCoding_자기이름</code> 文件夹中（将“<b class=\"keep-ko\">자기이름</b>”换成自己的姓名）。")}</div></div>` +
    `<p>${bi("폴더 안에는 이번 평가에서 읽을 CSV와 결과를 만들 Notebook, 프로젝트 환경을 알려 주는 파일이 들어 있습니다. 실습을 하면서 OpenCode와 나눈 대화도 JSON 파일로 저장할 겁니다. 마지막에는 이 파일들을 모두 담은 프로젝트를 ZIP 하나로 묶어 Google Form에 제출합니다. 파일을 올리려면 Google 계정으로 로그인해야 합니다.", "文件夹里有本次考核要读取的 CSV、用来生成结果的 Notebook，以及说明项目环境的文件。练习时与 OpenCode 的对话也要保存为 JSON 文件。最后，把包含这些文件的整个项目压缩成一个 ZIP 文件并提交到 Google Form。上传文件时必须登录 Google 账号。")}</p>` +
    `<div class="flow"><div><b>CSV</b>&nbsp;<small>${bi("원본 자료", "原始数据")}</small></div><i>→</i><div><b>Notebook</b>&nbsp;<small>${bi("실행과 결과", "运行与结果")}</small></div><i>→</i><div><b>JSON</b>&nbsp;<small>${bi("AI 대화 기록", "AI 对话记录")}</small></div><i>→</i><div><b>ZIP</b>&nbsp;<small>${bi("제출할 프로젝트", "提交的项目")}</small></div></div>` + note("그래프만 보면 AI에게 무슨 일을 맡겼고 결과를 어떻게 확인했는지 알 수 없습니다. 그래서 원본 자료와 실행 결과, AI 대화 기록을 함께 남깁니다.", "只看图表，无法知道你让 AI 做了什么，又是如何检查结果的。因此，需要把原始数据、运行结果和 AI 对话记录一起保留下来。", "ok"), "핵심"),
  page("a2", "2. 지난 시간과 연결", "같은 CSV지만 크기가 달라진다", "还是 CSV，只是规模更大",
    lead("4-2에서는 CSV의 첫 몇 행을 열어 열 이름과 값의 모양을 읽었습니다. 이번 파일은 12,960행이라 처음부터 끝까지 눈으로 읽을 수 없습니다. 먼저 열 이름과 값의 뜻을 살펴 자료가 무엇을 기록한 것인지 파악합니다. 필요한 경우 AI에게 설명을 요청하고, 무엇을 그래프로 볼지 정합니다.", "4-2 中，我们打开 CSV 的前几行，读过列名和值的形式。这次的文件有 12,960 行，无法从头到尾逐行阅读。先查看列名和各列值的含义，弄清这份数据记录了什么。需要时可以请 AI 说明，再决定要用图表观察什么。") +
    `<div class="row"><div class="pane"><div class="pt">4-2</div>${p("첫 몇 행을 보고 열 이름과 값의 모양을 확인했습니다.", "通过前几行确认列名和值的形式。")}</div><div class="pane okp"><div class="pt">5회</div>${p("자료가 무엇을 기록했는지 파악한 뒤, 보고 싶은 내용에 알맞은 그래프를 고릅니다.", "先弄清数据记录了什么，再选择适合所要观察内容的图表。")}</div></div>`, "핵심"),
  page("a3", "3. 확인하는 것", "결과와 함께 만든 과정을 본다", "不只看结果，也要看完成过程",
    lead("수행평가에서는 완성된 그래프만 보지 않습니다. 먼저 어떤 데이터인지와 각 값이 무엇을 뜻하는지 확인합니다. 다음으로 이 데이터를 시각화하는 데 알맞은 그래프를 고르고, AI가 실제 작업에 들어가기 전에 수행 계획을 세우게 합니다. 그 계획을 확인한 뒤 실행을 맡기고, 결과가 맞는지와 그래프를 통해 무엇이 보이는지를 살펴봅니다.", "实践考核不只看完成的图表。先确认这是什么数据，以及各列的值代表什么。接着选择适合可视化这份数据的图表，让 AI 在开始实际操作前先提出执行计划。确认计划后再让它执行，并检查结果是否正确、能从图表中看出什么。") +
    bullets([["자료 파악: 어떤 데이터인지, 한 행과 각 열의 값이 무엇을 뜻하는지 파악했는가?", "了解数据：是否弄清这是什么数据，以及一行记录和各列的值分别代表什么？"],["계획: 이 데이터를 시각화하는 데 알맞은 그래프를 고르고, AI가 제시한 작업 계획을 확인했는가?", "计划：是否选择了适合这份数据的图表，并检查了 AI 提出的工作计划？"],["실행: 확인한 계획에 따라 필요한 작업을 실제로 수행했는가?", "执行：是否按照确认过的计划实际完成了所需工作？"],["검토·해석: 그래프가 정확한지 확인하고, 이 그래프를 통해 무엇이 보이는지 적었는가?", "检查与解读：是否确认图表准确，并写下通过这张图能看出什么？"]]) + note("AI에게 바로 만들라고 하기보다 먼저 작업 계획을 세우게 합니다. 그 계획이 내가 고른 목표와 그래프에 맞는지 확인한 뒤 실행을 승인합니다. 실제 작업은 확인한 계획에 따라 AI가 수행할 수도 있고, 필요한 부분을 학생이 직접 실행할 수도 있습니다.", "不要直接让 AI 开始制作，而要先让它提出工作计划。确认计划符合自己选择的目标和图表后，再批准执行。实际工作可以由 AI 按确认过的计划完成，也可以由学生亲自运行必要的部分。"), "핵심"),
  page("a4", "4. 개발자가 코드를 나누는 방법", "폴더 구조와 환경 정보를 함께 전한다", "同时分享文件夹结构和环境信息",
    lead("Notebook과 CSV만 따로 보내면 파일이 원래 어디에 있었는지 알기 어렵습니다. Notebook이 <code>data</code> 폴더의 CSV를 읽도록 만들어졌다면, 폴더와 파일의 위치가 바뀌었을 때 자료를 찾지 못할 수도 있습니다. 그래서 프로젝트를 공유할 때는 <b>폴더 구조를 그대로 유지</b>합니다. 반면 <code>.venv</code>에 설치된 Python과 라이브러리는 컴퓨터마다 달라 그대로 복사하지 않고, <code>pyproject.toml</code>과 <code>uv.lock</code>처럼 환경을 다시 만들 수 있는 정보를 전합니다.", "如果只单独发送 Notebook 和 CSV，接收者很难知道这些文件原来放在哪里。若 Notebook 被设置为读取 <code>data</code> 文件夹中的 CSV，一旦文件夹或文件位置改变，就可能找不到数据。因此，分享项目时要<b>保持原有的文件夹结构</b>。但 <code>.venv</code> 中安装的 Python 和库会因电脑而异，不直接复制，而是提供 <code>pyproject.toml</code>、<code>uv.lock</code> 等可重建环境的信息。") +
    tree(`05/\n├─ README.md\n├─ pyproject.toml\n├─ uv.lock\n├─ notebooks/\n│  └─ 05_assessment1.ipynb\n├─ data/\n│  └─ 05-data-1-school-facility-usage.csv\n└─ evidence/\n   └─ opencode-session.json`) +
    p("공유할 때도 <code>05</code> 폴더 아래의 상대적인 위치를 바꾸지 않습니다. <code>.venv</code>는 빼지만, 그 환경을 다시 만들 수 있도록 <code>pyproject.toml</code>과 필요한 경우 <code>uv.lock</code>을 남깁니다.", "分享时也不要改变 <code>05</code> 文件夹下各文件的相对位置。虽然不包含 <code>.venv</code>，但要保留 <code>pyproject.toml</code>，并在需要时保留 <code>uv.lock</code>，让接收者能够重建环境。") +
    note("위 폴더의 <code>evidence</code>와 OpenCode JSON은 일반적인 프로젝트 공유 파일이 아닙니다. 이번 수행평가에서 AI를 어떻게 활용했는지 확인하기 위해 추가로 제출하는 <b>평가용 기록</b>입니다.", "上面文件夹中的 <code>evidence</code> 和 OpenCode JSON 不是通常分享项目时包含的文件。它们是本次实践考核为了确认 AI 使用过程而额外提交的<b>考核记录</b>。", "warn"), "핵심"),
  page("a5", "5. 프로젝트 공유의 기준", "받은 사람이 다시 실행할 수 있어야 한다", "接收者应该能够重新运行项目",
    lead("받은 사람이 프로젝트를 다시 실행하려면 Notebook과 CSV만으로는 부족합니다. 무엇을 하는 프로젝트인지 설명하는 파일과, 필요한 Python과 라이브러리를 자기 컴퓨터에 다시 준비할 수 있는 환경 정보도 함께 있어야 합니다. 파일마다 맡은 역할이 다릅니다.", "接收者要重新运行项目，只有 Notebook 和 CSV 还不够。还需要说明项目用途的文件，以及能在自己的电脑上重新准备 Python 和库的环境信息。每类文件承担的作用不同。") +
    `<div class="row r3"><div class="pane"><div class="pt">${bi("프로젝트 파일", "项目文件")}</div>${p("Notebook에는 작업과 실행 결과가, CSV에는 그래프의 바탕이 된 원본 자료가 담깁니다.", "Notebook 保存工作内容和运行结果，CSV 保存制作图表所依据的原始数据。")}</div><div class="pane"><div class="pt">${bi("프로젝트 설명", "项目说明")}</div>${p("<code>README.md</code>에는 프로젝트가 무엇을 하는지와 폴더·주요 파일의 구성을 적습니다.", "<code>README.md</code> 说明项目做什么，以及文件夹和主要文件如何组成。")}</div><div class="pane okp"><div class="pt">${bi("환경 정보", "环境信息")}</div>${p("<code>pyproject.toml</code>과 <code>uv.lock</code>은 필요한 Python과 라이브러리 정보를 전합니다.", "<code>pyproject.toml</code> 和 <code>uv.lock</code> 用来传递所需的 Python 与库信息。")}</div></div>` +
    note("이 세 가지가 같은 폴더 구조 안에 있어야 받은 사람이 프로젝트를 이해하고 실행 환경을 다시 만들 수 있습니다.", "这三类内容要保留在同一套文件夹结构中，接收者才能理解项目并重新建立运行环境。", "ok"), "핵심"),
  page("a6", "6. 작업과 원본 공유", "다시 만들 수 없는 작업 내용은 함께 보낸다", "无法重新生成的工作内容要一起发送",
    lead("Notebook에는 실행한 코드와 그 결과가 남고, CSV는 그 결과를 만든 원본 자료입니다. 이 두 파일은 프로젝트의 작업과 결과를 확인하고 다시 실행할 때 필요합니다. OpenCode 대화 기록은 성격이 다릅니다. 프로젝트 실행에 필요한 파일이 아니라, 이번 수행평가에서 무엇을 요청하고 어떤 계획을 확인했는지 보여 주는 평가 자료입니다.", "Notebook 中保留运行过的代码和结果，CSV 是生成这些结果所使用的原始数据。这两个文件用于查看项目工作并重新运行。OpenCode 对话记录的性质不同：它不是运行项目所需的文件，而是本次实践考核用来查看提出了什么请求、确认了什么计划的考核材料。") +
    `<div class="row"><div class="pane"><div class="pt">Notebook</div>${p("실행한 코드와 그래프, 검토와 해석이 함께 남습니다. 그래프가 화면에 나온 뒤 저장해야 출력도 파일에 남습니다.", "保存运行过的代码、图表、检查与解读。图表显示后再保存，输出结果才会保留在文件中。")}</div><div class="pane"><div class="pt">CSV</div>${p("그래프의 바탕이 된 원본 자료입니다. Notebook만 보내면 어떤 값을 읽어 그래프를 만들었는지 다시 확인할 수 없습니다.", "这是制作图表所依据的原始数据。如果只发送 Notebook，就无法重新确认图表读取了哪些数值。")}</div></div>` +
    `<div class="pane okp"><div class="pt">${bi("OpenCode JSON · 평가용", "OpenCode JSON · 考核用")}</div>${p("자료를 어떻게 파악했고, 어떤 그래프를 고르며, AI의 계획을 어떻게 확인했는지 보여 줍니다. 이번 수행평가에서는 제출하지만 일반적인 프로젝트 공유에는 보통 넣지 않습니다.", "展示如何理解数据、选择图表以及检查 AI 计划。本次实践考核需要提交，但一般分享项目时通常不会包含。")}</div>` +
    note("Notebook과 CSV는 프로젝트 파일입니다. OpenCode JSON은 이번 평가에서 AI 활용 과정을 확인하기 위해 추가하는 기록입니다.", "Notebook 和 CSV 是项目文件。OpenCode JSON 是本次考核为了确认 AI 使用过程而额外提交的记录。", "ok"), "핵심"),
  page("a7", "7. 환경 정보 공유", "환경 폴더 대신 환경을 다시 만들 정보를 보낸다", "不发送环境文件夹，而是发送重建环境所需的信息",
    lead("지난 시간에는 <code>pyproject.toml</code>을 읽어 필요한 Python 버전과 라이브러리를 확인하고, <code>uv sync</code>로 환경을 준비했습니다. 또 <code>uv add</code>를 직접 실행하거나 AI에게 맡겨 라이브러리를 추가한 뒤, <code>pyproject.toml</code>이 어떻게 바뀌었는지도 확인했습니다. 이 경험이 프로젝트 공유에도 그대로 이어집니다.", "上节课我们读取 <code>pyproject.toml</code>，确认所需的 Python 版本和库，并通过 <code>uv sync</code> 准备环境。我们还直接运行 <code>uv add</code> 或交给 AI 添加库，并确认 <code>pyproject.toml</code> 如何发生变化。这些经验也同样用于项目分享。") +
    `<div class="row"><div class="pane"><div class="pt"><code>README.md</code></div>${p("이 프로젝트가 무엇을 하는지, 폴더와 주요 파일이 어떻게 구성되어 있는지를 설명합니다. 필요한 경우 환경 준비와 실행 방법도 함께 적습니다.", "说明这个项目做什么，以及文件夹和主要文件如何组成。需要时，也会补充环境准备与运行方法。")}</div><div class="pane okp"><div class="pt"><code>pyproject.toml</code></div>${p("프로젝트에서 요구하는 Python 버전과 라이브러리 목록을 담습니다. <code>uv add</code>로 라이브러리를 추가하면 이 파일도 바뀝니다.", "记录项目所需的 Python 版本和库清单。使用 <code>uv add</code> 添加库时，这个文件也会更新。")}</div></div>` +
    `<div class="pane"><div class="pt"><code>uv.lock</code></div>${p("설치에 사용한 라이브러리의 정확한 버전을 기록합니다. 항상 필수인 파일은 아니지만, 이번 수행평가에서는 선생님 컴퓨터에서도 같은 버전으로 확인할 수 있도록 함께 제출합니다.", "记录安装时使用的库的准确版本。它并非任何情况下都必须分享，但本次实践考核要一起提交，以便老师的电脑也能使用相同版本进行检查。")}</div>` +
    note("받은 사람은 <code>pyproject.toml</code>과 <code>uv.lock</code>이 있는 폴더에서 <code>uv sync</code>를 실행합니다. 그러면 uv가 두 파일을 읽고 필요한 Python과 라이브러리를 준비합니다.", "接收者在包含 <code>pyproject.toml</code> 和 <code>uv.lock</code> 的文件夹中运行 <code>uv sync</code>。uv 会读取这两个文件，准备所需的 Python 和库。", "ok"), "핵심"),
  page("a8", "8. 다시 만들 파일", ".venv와 임시 파일은 공유하지 않는다", "不分享 .venv 和临时文件",
    lead("<code>.venv</code>에는 이 컴퓨터에서 사용할 Python과 라이브러리가 실제로 설치되어 있습니다. 그래서 용량이 크고, 다른 컴퓨터에 그대로 복사해도 경로나 운영체제가 달라 제대로 작동하지 않을 수 있습니다. 환경 정보 파일을 함께 보냈다면 받은 사람이 <code>uv sync</code>로 자기 컴퓨터에 맞는 <code>.venv</code>를 새로 만들 수 있습니다.", "<code>.venv</code> 中实际安装了当前电脑使用的 Python 和库，因此体积较大。即使原样复制到另一台电脑，也可能因为路径或操作系统不同而无法正常使用。只要分享了环境信息文件，接收者就能通过 <code>uv sync</code> 在自己的电脑上重新创建合适的 <code>.venv</code>。") +
    `<div class="row"><div class="pane"><div class="pt"><code>.venv</code></div>${p("<code>pyproject.toml</code>과 <code>uv.lock</code>을 읽어 다시 만들 수 있습니다. ZIP 용량을 크게 늘리므로 제출 사본에서 뺍니다.", "可以根据 <code>pyproject.toml</code> 和 <code>uv.lock</code> 重新创建。它会大幅增加 ZIP 大小，因此从提交副本中删除。")}</div><div class="pane"><div class="pt">캐시와 임시 파일</div>${p("프로그램을 실행하는 동안 자동으로 생긴 파일입니다. 없어도 다시 만들어지므로 공유하지 않습니다.", "这些文件在程序运行时自动生成，即使没有也会重新产生，因此不需要分享。")}</div></div>` +
    note("원본 작업 폴더에서 바로 지우지 않습니다. 5-2에서 제출용 사본을 만든 뒤, 그 사본에서만 <code>.venv</code>와 임시 파일을 뺍니다.", "不要直接从原始工作文件夹中删除。5-2 中先制作提交副本，再只从副本中删除 <code>.venv</code> 和临时文件。", "warn"), "핵심"),
  page("a9", "9. 공유할 파일 한눈에 보기", "프로젝트 파일과 평가용 기록을 구분한다", "区分项目文件与考核记录",
    lead("앞에서 살펴본 내용을 실제 공유 기준으로 정리해 봅시다. 프로젝트를 이해하고 다시 실행하는 데 필요한 파일은 함께 보내고, 컴퓨터마다 다시 만들 수 있는 폴더는 뺍니다. 프로젝트와 상황에 따라 선택할 수 있는 파일도 있습니다.", "把前面学过的内容整理成实际分享标准。用于理解项目并重新运行的文件要一起发送；每台电脑都能重新生成的文件夹则不发送。有些文件也可以根据项目和情况选择。") +
    `<div class="row r3"><div class="pane okp"><div class="pt">함께 공유</div>${p("Notebook · CSV · README.md · pyproject.toml", "Notebook · CSV · README.md · pyproject.toml")}<hr>${p("작업과 원본, 프로젝트 설명, Python과 라이브러리 요구사항입니다.", "包括工作结果与原始数据、项目说明、Python 与库的需求。")}</div>` +
    `<div class="pane"><div class="pt">상황에 따라 선택</div>${p("uv.lock", "uv.lock")}<hr>${p("같은 라이브러리 버전이 중요하면 <code>uv.lock</code>을 함께 보냅니다. 이번 수행평가에서는 선생님 컴퓨터에서도 같은 버전으로 확인할 수 있도록 제출합니다.", "需要保持相同库版本时一起发送 <code>uv.lock</code>。本次实践考核要提交，以便老师的电脑也能使用相同版本进行检查。")}</div>` +
    `<div class="pane"><div class="pt">보통 공유하지 않음</div>${p(".venv · 캐시 · 임시 파일", ".venv · 缓存 · 临时文件")}<hr>${p("환경 정보로 다시 만들 수 있거나 실행 중 자동으로 생기는 파일입니다.", "这些内容可以根据环境信息重新生成，或会在运行时自动产生。")}</div></div>` +
    note("이번 수행평가에서는 <code>uv.lock</code>도 제출합니다. OpenCode JSON은 일반적인 프로젝트 공유물이 아니라, AI 활용 과정을 확인하기 위해 이번 평가에서만 추가하는 기록입니다.", "本次实践考核也要提交 <code>uv.lock</code>。OpenCode JSON 不是一般项目分享文件，而是为了确认 AI 使用过程而仅在本次考核中额外提交的记录。", "warn"), "핵심"),
  page("a10", "10. 수업 파일 준비", "05 폴더를 통째로 열고 환경을 만든다", "打开整个 05 文件夹并创建环境",
    lead("2쪽에서 내려받은 <code>05</code> 폴더를 이제 VS Code에서 엽니다. Notebook 파일만 바로 열면 환경 파일과 데이터 폴더를 한 프로젝트로 인식하지 못할 수 있으므로, VS Code의 <b>폴더 열기</b>로 <code>05</code> 폴더 전체를 여세요.", "现在用 VS Code 打开第 2 页下载的 <code>05</code> 文件夹。如果只直接打开 Notebook 文件，VS Code 可能无法把环境文件和数据文件夹当作同一个项目处理。请使用 VS Code 的<b>打开文件夹</b>，打开整个 <code>05</code> 文件夹。") +
    steps([["내려받은 ZIP의 압축을 푼다.", "解压下载的 ZIP。"],["VS Code에서 <code>05</code> 폴더를 연다.", "在 VS Code 中打开 <code>05</code> 文件夹。"],["직접 <code>uv sync</code>를 실행하거나, 아래 요청을 OpenCode에 보낸다.", "自己运行 <code>uv sync</code>，或把下面的请求发送给 OpenCode。"],["<code>notebooks/05_assessment1.ipynb</code>를 연다.", "打开 <code>notebooks/05_assessment1.ipynb</code>。"],["오른쪽 위에서 <code>05</code> 폴더의 <code>.venv</code>를 사용하는 커널을 선택한다.", "在右上角选择使用 <code>05</code> 文件夹中 <code>.venv</code> 的内核。"]]) +
    prompt("OpenCode에 환경 준비 요청", "让 OpenCode 准备环境", `이 프로젝트는 uv를 사용해.\npip나 pip install은 사용하지 말고, 현재 05 폴더의 pyproject.toml과 uv.lock을 확인한 뒤 uv sync를 실행해 줘.\n끝나면 어떤 파일을 확인했고 어떤 작업을 했는지 알려 줘.`, `这个项目使用 uv。\n不要使用 pip 或 pip install。请先检查当前 05 文件夹中的 pyproject.toml 和 uv.lock，再运行 uv sync。\n完成后说明检查了哪些文件、执行了什么操作。`) +
    note("직접 실행하든 OpenCode에 맡기든 터미널의 시작 위치가 <code>05</code> 폴더여야 합니다. OpenCode에 맡길 때는 <code>uv</code>를 쓴다고 말해야 <code>pip install</code> 대신 프로젝트 방식에 맞게 준비합니다.", "无论自己运行还是交给 OpenCode，终端的起始位置都必须是 <code>05</code> 文件夹。交给 OpenCode 时要明确说明使用 <code>uv</code>，这样它才会按项目方式准备，而不是使用 <code>pip install</code>。", "warn"), "실습"),
  page("a11", "11. Notebook 커널 선택", "Python Environments에서 05 폴더의 .venv를 고른다", "在 Python Environments 中选择 05 文件夹的 .venv",
    lead("<code>uv sync</code>가 끝나면 <code>notebooks/05_assessment1.ipynb</code>를 열고 오른쪽 위의 <b>Select Kernel</b>을 누릅니다. 그다음 <b>Python Environments...</b>를 여세요. 커널 이름은 컴퓨터와 VS Code 상태에 따라 <code>.venv</code>, <code>jangdaehyun-assessment1</code>, 또는 <code>.venv/bin/python</code> 같은 실행 경로로 보일 수 있습니다. 이름만 보지 말고 <code>05</code> 폴더 안의 <code>.venv</code>를 가리키는지 확인합니다.", "<code>uv sync</code> 完成后，打开 <code>notebooks/05_assessment1.ipynb</code>，点击右上角的 <b>Select Kernel</b>，再打开 <b>Python Environments...</b>。根据电脑和 VS Code 的状态，内核名称可能显示为 <code>.venv</code>、<code>jangdaehyun-assessment1</code>，也可能显示为 <code>.venv/bin/python</code> 这样的运行路径。不要只看名称，要确认它指向 <code>05</code> 文件夹中的 <code>.venv</code>。") +
    `<div class="row"><div class="pane okp"><div class="pt">Python Environments 목록에 보이면</div>${steps([["<code>.venv</code>, <code>jangdaehyun-assessment1</code>, 또는 Python 경로로 보이는 항목을 살펴본다.", "查看名称为 <code>.venv</code>、<code>jangdaehyun-assessment1</code> 或显示为 Python 路径的项目。"],["표시된 경로가 <code>05\\.venv\\Scripts\\python.exe</code>로 이어지는 항목을 고른다.", "选择路径指向 <code>05\\.venv\\Scripts\\python.exe</code> 的项目。"]])}</div><div class="pane"><div class="pt">Python Environments 목록에 안 보이면</div>${steps([["같은 창의 <b>Create Python Environment</b>를 누른다.", "在同一个窗口中点击 <b>Create Python Environment</b>。"],["경로 선택에서 <code>05\\.venv\\Scripts\\python.exe</code>를 찾아 고른다.", "在路径选择中找到并选择 <code>05\\.venv\\Scripts\\python.exe</code>。"],["선택한 경로가 <code>05</code> 폴더 안의 <code>.venv</code>인지 다시 확인한다.", "再次确认所选路径位于 <code>05</code> 文件夹的 <code>.venv</code> 中。"]])}</div></div>`, "실습"),
  page("a11b", "11. Notebook 커널 선택", "선택한 경로를 마지막으로 확인한다", "最后确认所选路径",
    lead("커널을 골랐다면 Notebook 오른쪽 위에 선택한 항목이 보입니다. 표시 이름이 다르더라도 <code>05</code> 폴더 안의 <code>.venv</code>를 가리키면 바른 선택입니다.", "选好内核后，Notebook 右上角会显示所选项目。即使显示名称不同，只要它指向 <code>05</code> 文件夹中的 <code>.venv</code>，就是正确的选择。") +
    `<!-- [기존 자산] 05-1-01-select-kernel · Select Kernel → Python Environments → .venv 선택 흐름 -->` +
    `<figure class="fig"><img class="figimg" src="../../assets/img/05-1-01-select-kernel.png" alt="VS Code Notebook에서 Select Kernel을 누르고 Python Environments에서 05 폴더의 .venv를 선택하는 화면" data-id="05-1-01-select-kernel" data-spec="가로 16:9 · Windows VS Code · Python Environments 목록에 보이는 경우와 Create Python Environment로 경로를 선택하는 경우"><figcaption>${bi("그림 5-1-1. Python Environments 목록을 연 뒤, .venv가 보이는지에 따라 선택 방법이 나뉜다.", "图 5-1-1. 打开 Python Environments 列表后，根据是否能看到 .venv 选择对应的方法。")}</figcaption></figure>` +
    note("선택 뒤 오른쪽 위에는 <code>.venv</code> 대신 <code>jangdaehyun-assessment1</code>이나 Python 버전이 보일 수도 있습니다. 표시 이름보다 선택한 Python의 경로가 <code>05\\.venv\\Scripts\\python.exe</code>인지 확인하는 것이 중요합니다.", "选择后，右上角也可能不显示 <code>.venv</code>，而显示 <code>jangdaehyun-assessment1</code> 或 Python 版本。比显示名称更重要的是，所选 Python 的路径是否为 <code>05\\.venv\\Scripts\\python.exe</code>。", "ok"), "실습"),
  page("a12", "12. 수행평가 데이터", "12,960행의 학교 시설 이용 자료를 사용한다", "使用 12,960 行的学校设施使用数据",
    lead("<code>05-data-1-school-facility-usage.csv</code>는 학교 시설 이용 인원을 기록한 가상 표입니다. 열 이름과 시설 이름은 영어로 적혀 있으므로, 먼저 아래 다섯 열이 무엇을 뜻하는지만 확인합니다. 수행평가에서는 이 자료를 직접 요약하고 그래프로 나타낸 뒤, 그래프를 통해 무엇이 보이는지 찾습니다.", "<code>05-data-1-school-facility-usage.csv</code> 是记录学校设施使用人数的虚拟表格。列名和设施名称使用英文，因此先确认下面五列分别代表什么。在实践考核中，学生要自己汇总这份数据并制作图表，然后找出通过图表能看到的内容。") +
    `<div class="tablewrap"><table class="kv"><thead><tr><th>열 이름</th><th>${bi("뜻", "含义")}</th><th>${bi("값의 예", "示例值")}</th></tr></thead><tbody>` +
      `<tr><td><code>date</code></td><td>${bi("날짜", "日期")}</td><td><code>2026-03-02</code></td></tr>` +
      `<tr><td><code>weekday</code></td><td>${bi("요일", "星期")}</td><td><code>Monday</code></td></tr>` +
      `<tr><td><code>time_slot</code></td><td>${bi("24시간 형식의 시간대", "24 小时制时段")}</td><td><code>08:00</code></td></tr>` +
      `<tr><td><code>facility</code></td><td>${bi("학교 안의 공간", "校内场所")}</td><td><code>Computer_Room</code></td></tr>` +
      `<tr><td><code>visitors</code></td><td>${bi("이용 인원", "使用人数")}</td><td><code>18</code></td></tr>` +
    `</tbody></table></div>` +
    note("<code>facility</code> 값은 영어로 적혀 있고, 두 단어로 된 공간 이름은 <code>Computer_Room</code>처럼 밑줄로 이어져 있습니다. 이 자료는 실제 학교 통계가 아닌 수행평가용 가상 데이터입니다.", "<code>facility</code> 的值使用英文，两个单词组成的场所名称会像 <code>Computer_Room</code> 一样用下划线连接。这是为实践考核制作的虚拟数据，不是学校真实统计。", "warn"), "핵심"),
  page("a13", "13. AI에게 일을 나누어 주기", "한 번에 다 시키지 않고 판단의 순서를 남긴다", "不一次性交代所有任务，要保留判断顺序",
    lead("먼저 어떤 데이터인지와 각 값의 뜻을 확인합니다. 그다음 시각화할 내용과 알맞은 그래프를 고릅니다. 바로 제작을 맡기지 않고 AI가 작업 순서를 먼저 계획하게 한 뒤, 계획이 목표에 맞는지 확인하고 실행을 승인합니다. 마지막에는 결과의 정확성과 그래프를 통해 보이는 내용을 살펴봅니다.", "先确认这是什么数据以及各项数值的含义。接着确定要可视化的内容并选择合适的图表。不要立刻让 AI 制作，而要让它先规划工作步骤；确认计划符合目标后再批准执行。最后检查结果是否准确，并观察通过图表能看出什么。") +
    `<div class="flow"><div><b>1</b>&nbsp;<small>${bi("자료 파악", "了解数据")}</small></div><i>→</i><div><b>2</b>&nbsp;<small>${bi("선택·계획", "选择与计划")}</small></div><i>→</i><div><b>3</b>&nbsp;<small>${bi("실행", "执行")}</small></div><i>→</i><div><b>4</b>&nbsp;<small>${bi("검토·해석", "检查与解读")}</small></div></div>` + note("AI의 계획을 먼저 확인하면 자료 파악이나 검토 과정이 빠지는 일을 줄일 수 있습니다. 계획이 알맞으면 실행을 승인하고, 부족하면 계획부터 고칩니다.", "先检查 AI 的计划，可以减少遗漏数据理解或结果检查的情况。计划合适就批准执行，不足时先修改计划。", "ok"), "핵심"),
  page("a14", "14. 큰 자료를 확인하는 법", "전체를 훑지 않고 자료를 파악한다", "不用逐行浏览，也能了解数据",
    lead("1만 행이 넘는 파일은 한 줄씩 모두 읽을 수 없습니다. 먼저 열 이름과 몇 개의 값을 살펴 자료가 어떤 기록인지 파악합니다. 직접 읽어도 되고 AI에게 설명을 요청해도 됩니다. 그런 다음 이 자료에서 무엇을 보고 싶은지 정하고, 그 내용을 나타내기에 알맞은 그래프를 고릅니다.", "一万多行的数据无法逐行全部阅读。先查看列名和几项值，弄清这份数据记录了什么。可以自己阅读，也可以请 AI 说明。接着决定想从数据中观察什么，再选择适合呈现该内容的图表。") +
    bullets([["열 이름과 각 열에 들어 있는 값 몇 개를 살펴본다.", "查看列名和每列中的几项值。"],["직접 파악하거나 AI에게 이 자료가 무엇을 기록한 것인지 설명해 달라고 요청한다.", "自己理解数据，或请 AI 说明这份数据记录了什么。"],["이 자료에서 비교하거나 살펴볼 내용을 정한다.", "确定想从这份数据中比较或观察什么。"],["그 내용을 나타내기에 알맞은 그래프와 선택 이유를 정한다.", "选择适合呈现该内容的图表，并说明理由。"],["AI가 제시한 작업 계획을 확인하고 승인한 뒤 실행한다.", "检查 AI 提出的工作计划，批准后再执行。"],["그래프가 원본 자료에 맞는지 확인하고, 그래프를 통해 보이는 내용을 적는다.", "确认图表与原始数据相符，并写下从图表中看到的内容。"]]) + note("그래프 종류부터 정하지 않습니다. 먼저 자료를 파악하고 무엇을 보고 싶은지 정한 다음, 그 목적에 맞는 그래프를 고릅니다.", "不要一开始就确定图表类型。先了解数据并确定想观察什么，再选择符合目的的图表。", "ok"), "핵심"),
  page("a15", "15. AI 사용 기록", "AI와 나눈 대화도 함께 제출한다", "AI 对话记录也要一起提交",
    lead("OpenCode 대화 기록은 프로젝트를 다른 사람에게 공유할 때 보통 보내는 파일이 아닙니다. 이번 수행평가에서는 AI에게 무엇을 묻고 어떤 계획을 확인했는지 평가하기 위해 함께 제출합니다. 평가를 마친 뒤 관련 대화를 JSON 파일로 추출해 <code>evidence</code> 폴더에 넣습니다. 추출하는 방법은 5-2에서 순서대로 확인합니다.", "OpenCode 对话记录通常不是分享项目时会发送的文件。本次实践考核为了评价向 AI 提出了什么问题、确认了什么计划，要求一起提交。考核结束后，把相关对话导出为 JSON 文件，放入 <code>evidence</code> 文件夹。具体导出方法将在 5-2 中按步骤确认。") +
    `<div class="row"><div class="pane"><div class="pt">Notebook</div>${p("실행한 코드와 그래프, 검토·해석 내용이 남습니다.", "保留运行过的代码、图表以及检查和解读内容。")}</div><div class="pane okp"><div class="pt">OpenCode JSON</div>${p("자료를 파악하고 계획을 확인한 AI 대화 기록이 남습니다.", "保留理解数据并确认计划的 AI 对话记录。")}</div></div>` +
    note("관련 대화가 여러 개라면 그 기록을 모두 제출합니다. 지금은 추출 방법을 실습하지 않고, 제출할 기록이 있다는 점만 확인합니다.", "如果相关对话有多个，需要全部提交。现在不练习导出方法，只需确认之后还要提交这些记录。", "ok"), "핵심"),
  page("a16", "16. 다음 차시 전 확인", "시작할 준비가 되었는지 점검한다", "检查是否已准备好开始",
    lead("오늘은 평가에 들어가기 전에 프로젝트와 제출 방법을 살펴봤습니다. 다음 차시에 실습을 바로 시작할 수 있도록 아래 항목을 하나씩 확인하세요. 준비되지 않은 항목이 있다면 어느 단계에서 막혔는지를 선생님에게 알립니다.", "今天我们在进入考核之前，先了解了项目结构和提交方法。为了下节课能直接开始操作，请逐项确认下面的内容。如果还有没有准备好的部分，要告诉老师自己卡在了哪一步。") +
    bullets([["05 폴더를 VS Code로 열었다.", "已在 VS Code 中打开 05 文件夹。"],["<code>uv sync</code>가 완료되었다.", "<code>uv sync</code> 已完成。"],["Notebook에서 <code>.venv</code> 커널을 선택했다.", "Notebook 已选择 <code>.venv</code> 内核。"],["사용할 CSV가 <code>05-data-1-school-facility-usage.csv<\/code>인지 확인했다.", "已确认要使用的 CSV 是 <code>05-data-1-school-facility-usage.csv<\/code>。"],["자료 파악 → 선택·계획 → 실행 → 검토·해석의 네 단계를 알고 있다.", "知道了解数据 → 选择与计划 → 执行 → 检查与解读这四个阶段。"],["OpenCode 대화 JSON을 이번 평가 기록으로 제출한다는 것을 알고 있다.", "知道需要把 OpenCode 对话 JSON 作为本次考核记录提交。"],["그래프를 실행해 출력이 보인 뒤 <code>Ctrl+S</code>로 Notebook을 저장해야 한다는 것을 알고 있다.", "知道要先运行图表，在输出可见后按 <code>Ctrl+S</code> 保存 Notebook。"],["<code>.venv</code>를 빼고 프로젝트를 ZIP으로 제출한다는 것을 알고 있다.", "知道提交 ZIP 时要排除 <code>.venv</code>。"],["제출할 때 사용할 Google 계정으로 로그인할 수 있다.", "能够登录提交时要使用的 Google 账号。"]]) + note("다음 차시에는 AI가 제시한 계획을 확인하고 승인한 뒤 작업을 수행합니다. 마지막에는 결과를 검토하고 그래프를 통해 보이는 내용을 적어 제출합니다.", "下节课先检查并批准 AI 提出的计划，再完成相应任务。最后检查结果，写下通过图表能看出的内容并提交。", "ok"), "핵심"),
];

const pages52 = [
  opener("5-2", "수행평가 1<br/><span style=\"font-size:.62em;color:var(--muted);font-weight:700\">AI 활용 데이터 시각화</span>", "实践考核 1<br/><span style=\"font-size:.62em;color:var(--muted);font-weight:700\">AI 应用数据可视化</span>", "준비를 확인한 뒤 스스로 수행하고, 결과와 기록을 제출합니다.", "确认准备情况后独立完成任务，并提交结果与记录。", "5-1. 수행평가 1 안내", "5-1. 实践考核 1 说明", "6-1. 서비스 기획의 기초", "6-1. 服务策划基础"),
  page("b1", "1. 시작 전 점검", "평가를 시작할 준비가 되었는지 확인한다", "确认是否已做好开始考核的准备",
    lead("수행평가를 시작하기 전에 실행 환경과 파일을 먼저 확인합니다. 아래 항목이 모두 준비되어야 평가 도중 설치나 파일 찾기로 시간을 쓰지 않습니다. 준비되지 않은 항목이 있으면 시작하기 전에 선생님에게 알리세요.", "开始实践考核前，先检查运行环境和文件。下面各项都准备好后，才能避免在考核途中把时间花在安装或查找文件上。如有未准备好的项目，请在开始前告诉老师。") +
    bullets([["VS Code에서 <code>05</code> 폴더 전체를 열었다.", "已在 VS Code 中打开整个 <code>05</code> 文件夹。"],["<code>uv sync</code>가 끝나 <code>.venv</code>가 만들어졌다.", "<code>uv sync</code> 已完成并生成 <code>.venv</code>。"],["<code>notebooks</code> 폴더의 <code>05_assessment1.ipynb</code>를 열었다.", "已打开 <code>notebooks</code> 文件夹中的 <code>05_assessment1.ipynb</code>。"],["Notebook 오른쪽 위 커널이 <code>05</code> 폴더의 <code>.venv</code>이다.", "Notebook 右上角的内核是 <code>05</code> 文件夹中的 <code>.venv</code>。"],["<code>data</code> 폴더에 제공된 CSV 하나가 있다.", "<code>data</code> 文件夹中有老师提供的一份 CSV。"],["OpenCode를 같은 <code>05</code> 폴더에서 열었다.", "已在同一个 <code>05</code> 文件夹中打开 OpenCode。"]]) + note("준비 점검에서 오류가 나면 평가를 시작하지 말고 선생님에게 알립니다.", "准备检查中如出现错误，不要开始考核，要先告诉老师。", "warn"), "실습"),
  page("b2", "2. 수행평가에서 반드시 남길 것", "Notebook과 AI 대화에 판단 과정을 남긴다", "在 Notebook 与 AI 对话中保留判断过程",
    lead("평가를 시작하면 5-1에서 배운 방향에 따라 스스로 작업합니다. 아래 항목은 반드시 Notebook이나 OpenCode 대화에서 확인할 수 있어야 합니다. 정해진 답이나 그래프 종류는 없지만, 선택한 이유와 확인 과정은 빠지면 안 됩니다.", "开始考核后，请按照 5-1 学过的方向独立完成。下面各项必须能在 Notebook 或 OpenCode 对话中找到。答案和图表类型不固定，但不能缺少选择理由和检查过程。") +
    bullets([["어떤 데이터인지와 한 행·각 열의 값이 무엇을 뜻하는지 파악한다.", "弄清这是什么数据，以及一行记录和各列的值分别代表什么。"],["이 자료에서 시각화할 내용을 정한다.", "确定要从这份数据中可视化什么。"],["이 데이터를 시각화하는 데 알맞은 그래프와 선택 이유를 적는다.", "写下适合这份数据的图表以及选择理由。"],["AI가 작업 전에 제시한 계획을 읽고 승인하거나 고친 내용을 남긴다.", "保留阅读 AI 工作计划后批准或修改的内容。"],["직접 실행한 코드와 그래프 결과를 Notebook에 남긴다.", "在 Notebook 中保留亲自运行的代码和图表结果。"],["결과를 검토하고 이 그래프를 통해 보이는 내용을 적는다.", "检查结果，并写下通过这张图能看出的内容。"]]), "핵심"),
  page("b3", "3. 수행이 끝난 뒤 점검", "제출 전에 결과와 기록을 다시 확인한다", "提交前重新检查结果与记录",
    lead("작업을 마쳤다고 바로 압축하지 않습니다. Notebook을 처음부터 다시 실행해 같은 결과가 나오는지 확인하고, 기록하지 않은 판단이 없는지 살펴봅니다. 이 점검이 끝난 뒤에 제출용 사본을 만듭니다.", "完成任务后不要立刻压缩。先从头重新运行 Notebook，确认能得到相同结果，并检查是否有遗漏的判断记录。完成这些检查后，再制作提交副本。") +
    bullets([["Notebook의 모든 셀을 처음부터 다시 실행했다.", "已从头重新运行 Notebook 的所有单元格。"],["코드와 그래프가 오류 없이 다시 나타났다.", "代码和图表已无错误地重新显示。"],["그래프의 항목과 값이 원본 자료와 실행 결과에 맞게 반영되었다.", "图表中的项目和数值与原始数据及运行结果相符。"],["선택 이유, AI 계획 확인, 검토 내용, 그래프를 통해 보이는 내용을 모두 적었다.", "已写下选择理由、AI 计划检查、结果检查以及通过图表能看出的内容。"],["그래프가 화면에 나온 뒤 <code>Ctrl+S</code>로 저장하고, Notebook을 다시 열어 그래프가 남아 있는지 확인했다.", "图表显示后按 <code>Ctrl+S</code> 保存，并重新打开 Notebook 确认图表仍然存在。"]]) + note("그래프를 실행하지 않았거나 출력이 보이기 전에 저장하면, 선생님이 제출 파일을 열었을 때 그래프가 보이지 않습니다. 반드시 그래프가 나온 뒤 저장하세요.", "如果没有运行图表，或在输出出现前就保存，老师打开提交文件时将看不到图表。请务必在图表显示后再保存。", "warn"), "실습"),
  page("b4", "4. AI 대화 기록 저장", "관련된 OpenCode 대화를 모두 JSON으로 내보낸다", "把所有相关 OpenCode 对话导出为 JSON",
    lead("수행평가 과정이 여러 대화에 나뉘었다면 그 대화도 모두 제출 대상입니다. OpenCode에게 이번 수행평가와 관련된 대화를 찾아 각각 JSON 파일로 저장하게 합니다. 학생이 명령을 직접 입력할 필요는 없습니다.", "如果实践考核过程分散在多个对话中，这些对话都要提交。请让 OpenCode 找出与本次考核有关的对话，并分别保存为 JSON 文件。学生不需要亲自输入命令。") +
    prompt("OpenCode에 요청", "向 OpenCode 提出请求", `이번 수행평가와 관련된 OpenCode session을 모두 확인해서 evidence 폴더에 JSON으로 내보내 줘.\n각 session을 opencode-session-1.json, opencode-session-2.json처럼 번호를 붙여 저장해 줘.\n각 파일이 비어 있지 않은지도 확인하고, 저장한 파일을 알려 줘.`, `请确认与本次实践考核有关的所有 OpenCode session，并把它们导出为 JSON 保存到 evidence 文件夹。\n请将每个 session 分别保存为 opencode-session-1.json、opencode-session-2.json 等带编号的文件。\n确认每个文件都不是空文件，并告诉我保存了哪些文件。`) +
    bullets([["<code>evidence</code> 폴더에 관련 대화 수만큼 JSON 파일이 있다.", "<code>evidence</code> 文件夹中的 JSON 文件数量与相关对话数量一致。"],["각 JSON 파일이 0KB가 아니고 내용을 열어 볼 수 있다.", "每个 JSON 文件都不是 0KB，并且可以打开查看内容。"],["다른 수업의 대화 기록은 들어 있지 않다.", "没有包含其他课程的对话记录。"]]), "실습"),
  page("b5", "5. 제출용 ZIP 만들기", "원본은 두고 제출용 사본만 정리해 압축한다", "保留原文件夹，只整理提交副本并压缩",
    lead("작업하던 <code>05</code> 폴더에서 파일을 바로 지우지 않습니다. 먼저 폴더 전체를 복사해 제출용 사본을 만들고, 사본에서 제출하지 않을 항목만 지웁니다.", "不要直接删除正在使用的 <code>05</code> 文件夹中的文件。先复制整个文件夹作为提交副本，只在副本中删除不提交的项目。") +
    steps([["파일 탐색기에서 <code>05</code> 폴더를 복사해 같은 위치에 붙여넣는다.", "在文件资源管理器中复制 <code>05</code> 文件夹，并粘贴到同一位置。"],["복사한 폴더 이름을 <code>05_assessment1_이름</code>으로 바꾼다.", "把复制的文件夹重命名为 <code class=\"keep-ko\">05_assessment1_이름</code>（将“<b class=\"keep-ko\">이름</b>”换成自己的姓名）。"],["제출용 사본에서 <code>.venv</code>, <code>__pycache__</code>, 캐시·임시 파일만 지운다.", "只在提交副本中删除 <code>.venv</code>、<code>__pycache__</code>、缓存和临时文件。"]]) +
    note("원본 <code>05</code> 폴더는 그대로 두고, 복사한 제출용 사본에서만 불필요한 항목을 지웁니다.", "保留原始 <code>05</code> 文件夹，只在复制的提交副本中删除不需要的项目。", "warn"), "실습"),
  page("b5b", "5. 제출용 ZIP 만들기", "제출할 파일을 확인한 뒤 ZIP으로 압축한다", "确认提交文件后压缩为 ZIP",
    lead("불필요한 항목을 지웠다면 필요한 파일이 남았는지 먼저 확인합니다. 확인을 마친 제출용 사본만 ZIP으로 압축합니다.", "删除不需要的项目后，先确认所需文件都还在。只把检查完成的提交副本压缩为 ZIP。") +
    steps([["<code>README.md</code>, <code>pyproject.toml</code>, <code>uv.lock</code>, Notebook, CSV, 관련 OpenCode 대화 JSON이 남아 있는지 확인한다.", "确认 <code>README.md</code>、<code>pyproject.toml</code>、<code>uv.lock</code>、Notebook、CSV 和相关 OpenCode 对话 JSON 都还在。"],["사본 폴더를 마우스 오른쪽 단추로 누르고 <b>더 많은 옵션 표시 → 보내기 → 압축(ZIP) 폴더</b>를 고른다.", "右键单击副本文件夹，依次选择电脑上显示的韩文菜单 <b class=\"keep-ko\">더 많은 옵션 표시 → 보내기 → 압축(ZIP) 폴더</b>。"]]) +
    `<!-- [기존 자산] 05-2-01-windows-zip · Windows 파일 탐색기에서 제출용 사본을 만들고 ZIP으로 압축하는 순서 -->` +
    `<figure class="fig"><img class="figimg" src="../../assets/img/05-2-01-windows-zip.png" alt="Windows 파일 탐색기에서 05 폴더를 복사하고 제출용 사본에서 제외할 폴더를 지운 뒤 오른쪽 클릭 메뉴로 ZIP 파일을 만드는 순서" data-id="05-2-01-windows-zip" data-spec="가로 21:9 · Windows 파일 탐색기 · 폴더 복사, 제외 항목 삭제, ZIP 압축"><figcaption>${bi("그림 5-2-1. 원본 폴더는 그대로 두고 제출용 사본만 정리해 ZIP으로 압축한다.", "图 5-2-1. 保留原文件夹，只整理提交副本并压缩为 ZIP。")}</figcaption></figure>` +
    note("학교 PC에서 마우스 오른쪽 메뉴에 <b>ZIP 파일로 압축</b>이 바로 보이면 그 항목을 눌러도 됩니다. 완성된 파일 이름이 <code>05_assessment1_이름.zip</code>인지 확인합니다.", "如果学校电脑的右键菜单中直接显示韩文选项 <b class=\"keep-ko\">ZIP 파일로 압축</b>，也可以直接选择。确认最终文件名是 <code class=\"keep-ko\">05_assessment1_이름.zip</code>，其中“<b class=\"keep-ko\">이름</b>”要换成自己的姓名。", "warn"), "실습"),
  page("b6", "6. Google Form 제출", "ZIP 하나를 올리고 제출 완료 화면을 확인한다", "上传一个 ZIP 并确认提交完成",
    lead("제출용 ZIP을 만들었으면 선생님이 안내한 Google Form을 엽니다. 파일을 올리려면 Google 계정으로 로그인해야 합니다.", "制作好提交用 ZIP 后，打开老师提供的 Google Form。要上传文件，必须先登录 Google 账号。") +
    `<div class="folder-download-row form-link-row"><a class="download-cta form-cta" href="https://docs.google.com/forms/d/e/1FAIpQLSe87c6APvABIz2IdczisycuMaOb6qG2h9Cg3FQhvx5uTwHwiA/viewform?usp=publish-editor" target="_blank" rel="noopener"><span class="download-icon" aria-hidden="true">↗</span><span><b class="ko">수행평가 제출 Form 열기</b><b class="zh">打开实践考核提交表单</b><small>Google Forms</small></span></a><div class="download-note">${bi("Google 계정으로 로그인해야 ZIP 파일을 올릴 수 있습니다. 제출 버튼을 누르기 전에 업로드된 파일명을 확인합니다.", "必须登录 Google 账号才能上传 ZIP 文件。点击提交前，请确认已上传的文件名。")}</div></div>` +
    prompt("제출 Form 주소 복사", "复制提交表单地址", `https://docs.google.com/forms/d/e/1FAIpQLSe87c6APvABIz2IdczisycuMaOb6qG2h9Cg3FQhvx5uTwHwiA/viewform?usp=publish-editor`, `https://docs.google.com/forms/d/e/1FAIpQLSe87c6APvABIz2IdczisycuMaOb6qG2h9Cg3FQhvx5uTwHwiA/viewform?usp=publish-editor`), "실습"),
  page("b6b", "6. Google Form 제출", "올린 파일명과 제출 완료 화면을 확인한다", "确认上传文件名与提交完成画面",
    lead("파일을 고른 뒤 화면에 표시된 파일명이 내 ZIP과 같은지 확인합니다. 제출 완료 화면이 나올 때까지 창을 닫지 않습니다.", "选择文件后，确认页面上显示的文件名与自己的 ZIP 一致。在看到提交完成画面前不要关闭窗口。") +
    steps([["Google 계정에 로그인하고 제출 링크를 연다.", "登录 Google 账号并打开提交链接。"],["학년과 이름을 입력한다.", "填写表单中的“<b class=\"keep-ko\">학년</b>”（年级）和“<b class=\"keep-ko\">이름</b>”（姓名）。"],["<code>05_assessment1_이름.zip</code> 하나를 올린다.", "上传一个 <code class=\"keep-ko\">05_assessment1_이름.zip</code>（将“<b class=\"keep-ko\">이름</b>”换成自己的姓名）。"],["제출 버튼을 누르기 전에 업로드된 파일명과 ZIP 내용을 마지막으로 확인한다.", "点击提交前，最后确认上传文件名和 ZIP 内容。"],["제출 버튼을 누르고 제출 완료 메시지를 확인한다.", "点击提交，并确认出现提交完成提示。"]]) + note("파일 용량이 너무 크면 ZIP 안에 <code>.venv</code>가 들어갔는지 먼저 확인합니다. 다른 웹사이트에 올리지 말고 선생님에게 알립니다.", "如果文件过大，先检查 ZIP 中是否包含 <code>.venv</code>。不要上传到其他网站，要告诉老师。", "ok"), "실습"),
];

function shell(lesson, titleKo, titleZh, pages) {
  const fixedLabels = [
    ["5회", "第 5 次课"],
    ["프로젝트 파일", "项目文件"],
    ["프로젝트 설명", "项目说明"],
    ["환경 정보", "环境信息"],
    ["OpenCode JSON · 평가용", "OpenCode JSON · 考核用"],
    ["캐시와 임시 파일", "缓存与临时文件"],
    ["함께 공유", "一起分享"],
    ["상황에 따라 선택", "视情况选择"],
    ["보통 공유하지 않음", "通常不分享"],
    ["Python Environments 목록에 보이면", "Python Environments 列表中可见时"],
    ["Python Environments 목록에 안 보이면", "Python Environments 列表中不可见时"],
  ];
  pages = pages.map((markup) => {
    let localized = markup.replaceAll("<th>열 이름</th>", `<th>${bi("열 이름", "列名")}</th>`);
    for (const [ko, zh] of fixedLabels) {
      localized = localized.replaceAll(`<div class="pt">${ko}</div>`, `<div class="pt">${bi(ko, zh)}</div>`);
    }
    return localized;
  });
  const is51 = lesson === "5-1";
  let previousKick = "";
  const toc = pages.map((markup, i) => {
    if (i === 0) return `<a href="#opener"><span class="n">·</span>${bi("차시 표지", "课时首页")}</a>`;
    const id = markup.match(/<section class="[^"]*" id="([^"]+)"/)?.[1];
    const koKick = markup.match(/<div class="kick"><span class="ko">([^<]+)<\/span>/)?.[1] || "";
    const zhKick = markup.match(/<div class="kick"><span class="ko">[^<]+<\/span><span class="zh">([^<]+)<\/span>/)?.[1] || "";
    if (!id || !koKick || koKick === previousKick) return "";
    previousKick = koKick;
    const number = koKick.match(/^\d+/)?.[0] || String(i);
    const koLabel = koKick.replace(/^\d+\.\s*/, "");
    const zhLabel = zhKick.replace(/^\d+\.\s*/, "") || koLabel;
    return `<a href="#${id}"><span class="n">${number}</span>${bi(koLabel, zhLabel)}</a>`;
  }).join("");
  return `<!DOCTYPE html><html lang="ko" class="lang-ko"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${lesson}. ${titleKo} · 정보와 디지털 문해력</title><meta name="description" content="장대현중고등학교 정보와 디지털 문해력 ${lesson}"/><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800;900&family=IBM+Plex+Sans+KR:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="../../assets/textbook.css"/></head><body class="lang-ko"><div id="top"><button class="menu" onclick="tbToggleToc()">☰ ${bi("목차", "目录")}</button><button id="modeBtn" onclick="tbToggleMode()">${bi("한 장씩 보기", "逐页查看")}</button><button class="lng" onclick="tbToggleLang()">中文</button><div class="brand"><em>${lesson}</em> <span class="lesson">${bi(titleKo, titleZh)}</span></div><div class="spacer"></div><div class="pct" id="count">1 / ${pages.length}</div><button class="pbtn" onclick="window.print()">${bi("인쇄", "打印")}</button></div><div id="prog"></div><nav id="toc"><div class="h">${bi(`이 차시: ${lesson}`, `本课时: ${lesson}`)}</div>${toc}<div class="h">${bi("전체 차시", "全部课时")}</div><a href="../../index.html"><span class="n">${bi("표지", "首页")}</span>${bi("전체 목차", "全部目录")}</a><a href="../../04/textbook/04-2.html"><span class="n">4-2</span>${bi("pandas로 표 데이터를 쉽게 사용하기", "用 pandas 轻松处理表格数据")}</a><a href="../../05/textbook/05-1.html" class="${is51 ? "here" : ""}"><span class="n">5-1</span>${bi("수행평가 1 안내", "实践考核 1 说明")}</a><a href="../../05/textbook/05-2.html" class="${!is51 ? "here" : ""}"><span class="n">5-2</span>${bi("수행평가 1 실시·제출", "实践考核 1 实施与提交")}</a><a href="../../06/textbook/06-1.html"><span class="n">6-1</span>${bi("서비스 기획의 기초", "服务策划基础")}</a></nav><div id="scrim" onclick="tbToggleToc(false)"></div><main>${pages.join("\n")}</main><div id="pager"><button id="pprev">‹</button><button id="pnext">›</button></div><button class="totop" id="totop" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑</button><script src="../../assets/textbook.js"></script></body></html>`;
}

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "05-1.html"), shell("5-1", "수행평가 1 안내", "实践考核 1 说明", pages51));
fs.writeFileSync(path.join(out, "05-2.html"), shell("5-2", "수행평가 1 실시·제출", "实践考核 1 实施与提交", pages52));
console.log(`05-1=${pages51.length} pages`);
console.log(`05-2=${pages52.length} pages`);

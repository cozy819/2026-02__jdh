import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";

const workspaceDir = process.env.WORKSPACE_DIR;
const skillDir = process.env.SKILL_DIR;
const pythonExecutable = process.env.PYTHON_EXE;
if (!workspaceDir || !skillDir || !pythonExecutable) {
  throw new Error("WORKSPACE_DIR, SKILL_DIR, PYTHON_EXE are required");
}

const { importRuntimeModule } = await import(
  pathToFileURL(path.join(skillDir, "container_tools/runtime_helpers.mjs")).href
);
const { FileBlob, PresentationFile } = await importRuntimeModule("@oai/artifact-tool");

const sourcePath = path.join(workspaceDir, "05/ppt/05-1_수행평가_1_안내.pptx");
const stagingDir = path.join(workspaceDir, ".codex-finalizer/week05-ppt-final");
const buildTag = `05-1-${Date.now()}`;
const candidatePath = path.join(stagingDir, `${buildTag}-candidate.pptx`);
const checkedPath = path.join(stagingDir, `output/${buildTag}-checked.pptx`);
const receiptPath = path.join(stagingDir, `receipts/${buildTag}.validation.json`);
await fs.mkdir(path.dirname(checkedPath), { recursive: true });
await fs.mkdir(path.dirname(receiptPath), { recursive: true });

const { finalizePresentation } = await import(
  pathToFileURL(path.join(skillDir, "container_tools/artifact_tool_utils.mjs")).href
);

const sourceBytes = await fs.readFile(sourcePath);
const sourceSha256 = crypto.createHash("sha256").update(sourceBytes).digest("hex");
const presentation = await PresentationFile.importPptx(await FileBlob.load(sourcePath));

function textOf(shape) {
  return String(shape.text ?? "").replace(/\s+/g, " ").trim();
}

function textAt(slide, left, top, value, tolerance = 3) {
  const shape = slide.shapes.items.find((item) =>
    item.text &&
    Math.abs(item.position.left - left) <= tolerance &&
    Math.abs(item.position.top - top) <= tolerance
  );
  if (!shape) throw new Error(`Text shape not found near ${left},${top}`);
  shape.text.replace(String(shape.text), value);
}

function replaceMatching(slide, match, value) {
  const shape = slide.shapes.items.find((item) => textOf(item).includes(match));
  if (!shape) throw new Error(`Text not found: ${match}`);
  shape.text.replace(String(shape.text), value);
}

function replaceAnyMatching(slide, matches, value) {
  const shape = slide.shapes.items.find((item) => matches.some((match) => textOf(item).includes(match)));
  if (!shape) throw new Error(`None of the text variants were found: ${matches.join(" | ")}`);
  shape.text.replace(String(shape.text), value);
}

function replaceExact(slide, match, value) {
  const shape = slide.shapes.items.find((item) => textOf(item) === match);
  if (!shape) throw new Error(`Exact text not found: ${match}`);
  shape.text.replace(String(shape.text), value);
}

function replaceExactAny(slide, matches, value) {
  const shape = slide.shapes.items.find((item) => matches.includes(textOf(item)));
  if (!shape) throw new Error(`None of the exact text variants were found: ${matches.join(" | ")}`);
  shape.text.replace(String(shape.text), value);
}

function setCardSlide(slide, { title, cards, footer, notes }) {
  textAt(slide, 55.68, 74.88, title);
  const xs = [74.88, 478.08, 878.4];
  for (let i = 0; i < 3; i++) {
    textAt(slide, xs[i], 209.28, cards[i][0]);
    textAt(slide, xs[i], 261.12, cards[i][1]);
  }
  textAt(slide, 76.8, 552, footer);
  slide.speakerNotes.textFrame.setText(notes);
}

function addText(slide, value, position, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position,
    fill: "none",
    line: { fill: "none", width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    typeface: "IBM Plex Sans KR",
    fontSize: 22,
    color: "#1B1D21",
    autoFit: "shrinkText",
    ...style,
  };
  return shape;
}

function addPanel(slide, { left, top, width, height, fill = "#F1F2F4", lineFill = "#D7DEE3" }) {
  return slide.shapes.add({
    geometry: "roundRect",
    position: { left, top, width, height },
    fill,
    line: { fill: lineFill, width: 1.2 },
  });
}

function coverContent(slide, top = 190, height = 450) {
  slide.shapes.add({
    geometry: "rect",
    position: { left: 40, top, width: 1200, height },
    fill: "#FFFFFF",
    line: { fill: "none", width: 0 },
  });
}

function addStepCard(slide, { number, title, body, left, top, width, height, accent = false, bodyFontSize = 21 }) {
  addPanel(slide, {
    left, top, width, height,
    fill: accent ? "#E8F4F1" : "#F1F2F4",
    lineFill: accent ? "#0C8D99" : "#D7DEE3",
  });
  addText(slide, String(number), { left: left + 20, top: top + 18, width: 45, height: 35 }, {
    fontSize: 24, bold: true, color: accent ? "#0C7F89" : "#FF5C00",
  });
  addText(slide, title, { left: left + 20, top: top + 58, width: width - 40, height: 36 }, {
    fontSize: 24, bold: true,
  });
  addText(slide, body, { left: left + 20, top: top + 100, width: width - 40, height: height - 105 }, {
    fontSize: bodyFontSize, color: "#686F78",
  });
}

function addFooterBand(slide, value, { top = 565, fill = "#FFF0E8", color = "#C54800" } = {}) {
  addPanel(slide, { left: 55, top, width: 1170, height: 58, fill, lineFill: fill });
  addText(slide, value, { left: 85, top: top + 14, width: 1110, height: 30 }, {
    fontSize: 19, bold: true, color, horizontalAlignment: "center",
  });
}

function normalizeFonts(deck) {
  for (const slide of deck.slides.items) {
    for (const shape of slide.shapes.items) {
      if (!shape.text?.style) continue;
      const current = { ...shape.text.style };
      const typeface = current.typeface === "IBM Plex Mono" ? "IBM Plex Mono" : "IBM Plex Sans KR";
      shape.text.style = { ...current, typeface };
    }
  }
}

if (presentation.slides.items.length === 13) {
  const sharingSource = presentation.slides.getItem(5);
  for (let i = 0; i < 4; i++) sharingSource.duplicate();
} else if (presentation.slides.items.length !== 17) {
  throw new Error(`Expected 13 or 17 slides, found ${presentation.slides.items.length}`);
}

const dataIntroSlide = presentation.slides.getItem(2);
replaceAnyMatching(dataIntroSlide, ["1만 행은 구조와 요약으로 확인", "1만 행은 자료의 구조와 의미 파악"], "1만 행은 자료의 구조와 의미 파악");
replaceAnyMatching(dataIntroSlide, ["한 행·각 열의 뜻 요약표와 그래프로 전체 확인", "한 행·각 열의 뜻 보고 싶은 내용과 그래프 선택"], "한 행·각 열의 뜻\n보고 싶은 내용과 그래프 선택");

const processSlide = presentation.slides.getItem(3);
replaceAnyMatching(processSlide, ["결과와 함께 만든 과정을 본다"], "결과와 함께 만든 과정을 본다");
coverContent(processSlide);
addStepCard(processSlide, { number: 1, title: "자료 파악", body: "어떤 데이터인지와\n한 행·각 열의 뜻을 확인", left: 55, top: 210, width: 555, height: 155 });
addStepCard(processSlide, { number: 2, title: "계획", body: "알맞은 그래프를 고르고\nAI가 제시한 작업 계획을 확인", left: 650, top: 210, width: 575, height: 155 });
addStepCard(processSlide, { number: 3, title: "실행", body: "확인한 계획에 따라\n필요한 작업을 실제로 수행", left: 55, top: 390, width: 555, height: 155 });
addStepCard(processSlide, { number: 4, title: "검토·해석", body: "그래프가 정확한지 확인하고\n화면에서 보이는 내용을 기록", left: 650, top: 390, width: 575, height: 155, accent: true });
addFooterBand(processSlide, "그래프만 보는 것이 아니라, 이해하고 계획한 뒤 실행하고 검토한 과정도 함께 봅니다.", { top: 575 });
processSlide.speakerNotes.textFrame.setText("[8–11분] 수행평가에서 확인하는 네 단계\n\n교과서와 같은 네 단계로 설명한다. 계획 단계에서 알맞은 그래프를 고르고 AI가 제시한 작업 계획을 확인한다. 실행 뒤에는 결과를 검토하고 그래프를 통해 보이는 내용을 해석한다.");

const folderSlide = presentation.slides.getItem(4);
textAt(folderSlide, 55.68, 74.88, "폴더 구조와 환경 정보를 함께 전한다");
coverContent(folderSlide);
addPanel(folderSlide, { left: 55, top: 205, width: 500, height: 350, fill: "#1B1D21", lineFill: "#1B1D21" });
addText(folderSlide, "05/\n├─ README.md\n├─ pyproject.toml\n├─ uv.lock\n├─ notebooks/\n│  └─ 05_assessment1.ipynb\n├─ data/\n│  └─ 05-data-1-school-facility-usage.csv\n└─ evidence/", { left: 85, top: 230, width: 450, height: 300 }, {
  fontSize: 18, typeface: "IBM Plex Mono", color: "#FFFFFF",
});
addPanel(folderSlide, { left: 605, top: 205, width: 620, height: 155, fill: "#E8F4F1", lineFill: "#0C8D99" });
addText(folderSlide, "폴더 구조는 그대로", { left: 635, top: 230, width: 560, height: 38 }, { fontSize: 24, bold: true, color: "#0C7F89" });
addText(folderSlide, "Notebook이 data 폴더의 CSV를 찾을 수 있도록\n폴더와 파일의 위치를 바꾸지 않습니다.", { left: 635, top: 285, width: 560, height: 60 }, { fontSize: 18, color: "#4C545D" });
addPanel(folderSlide, { left: 605, top: 385, width: 620, height: 170 });
addText(folderSlide, "환경은 정보로 전달", { left: 635, top: 410, width: 560, height: 38 }, { fontSize: 24, bold: true });
addText(folderSlide, ".venv는 복사하지 않습니다. pyproject.toml과 uv.lock으로\n필요한 Python 버전과 라이브러리를 알립니다.", { left: 635, top: 465, width: 560, height: 65 }, { fontSize: 18, color: "#4C545D" });
addFooterBand(folderSlide, "내부 위치는 유지하고, 실행 환경은 다시 만들 수 있는 정보로 전합니다.", { top: 580 });
folderSlide.speakerNotes.textFrame.setText("[11–14분] 폴더 구조와 환경 정보\n\nNotebook과 CSV의 상대적인 위치는 그대로 유지해야 파일을 찾을 수 있다. .venv는 컴퓨터마다 달라 직접 복사하지 않고, pyproject.toml과 uv.lock으로 필요한 환경 정보를 전한다.");

setCardSlide(presentation.slides.getItem(5), {
  title: "받은 사람이 다시 실행할 수 있어야 한다",
  cards: [
    ["프로젝트 파일", "Notebook · CSV\n\n작업과 원본\n다시 실행할 내용"],
    ["프로젝트 설명", "README.md\n\n무엇을 하는 프로젝트인지\n폴더와 주요 파일 구성"],
    ["환경을 만들 정보", "pyproject.toml · uv.lock\n\n필요한 Python과\n라이브러리 정보"],
  ],
  footer: "받은 사람은 README를 읽고, 환경 정보를 이용해 프로젝트를 다시 실행합니다.",
  notes: "[14–16분] 프로젝트 공유의 기준\n\n이번 쪽에서는 일반적인 프로젝트 공유에 필요한 내용만 정리한다. Notebook과 CSV는 작업과 원본을 전하고, README는 프로젝트를 설명하며, pyproject.toml과 uv.lock은 실행 환경을 다시 만드는 데 쓰인다.",
});

setCardSlide(presentation.slides.getItem(6), {
  title: "다시 만들 수 없는 작업 내용은 함께 보낸다",
  cards: [
    ["Notebook", "실행 코드 · 그래프\n검토와 해석\n\n출력이 보인 뒤\n저장"],
    ["CSV", "그래프의 바탕이 된\n원본 자료\n\nNotebook의 숫자를\n다시 확인하는 기준"],
    ["OpenCode JSON · 평가용", "요청 · 계획 · 확인\n대화의 흐름\n\n일반 공유에는\n보통 포함하지 않음"],
  ],
  footer: "Notebook과 CSV는 프로젝트 파일이고, OpenCode JSON은 이번 평가에서만 추가합니다.",
  notes: "[16–18분] 작업과 원본 공유\n\nNotebook과 CSV는 작업을 확인하고 다시 실행하는 프로젝트 파일이다. OpenCode JSON은 AI 활용 과정을 확인하기 위한 평가용 기록이며 일반 공유에는 보통 넣지 않는다.",
});

setCardSlide(presentation.slides.getItem(7), {
  title: "환경 폴더 대신 환경을 다시 만들 정보를 보낸다",
  cards: [
    [".venv를 그대로 보내면", "용량이 크고\n경로와 운영체제가 달라\n그대로 작동하지 않을 수 있음"],
    ["환경 정보를 보내면", "pyproject.toml · uv.lock\n\n필요한 Python과\n라이브러리 버전을 전달"],
    ["받은 컴퓨터에서", "uv sync 실행\n\n자기 컴퓨터에 맞는\n.venv를 새로 만듦"],
  ],
  footer: ".venv를 복사하지 않고, 받은 컴퓨터에서 uv sync로 다시 만듭니다.",
  notes: "[18–21분] 환경 정보 공유\n\n.venv는 용량이 크고 컴퓨터의 경로와 운영체제에 영향을 받는다. pyproject.toml과 uv.lock을 보내면 받은 사람은 uv sync를 실행해 자기 컴퓨터에 맞는 .venv를 만들 수 있다.",
});

const dataSlide = presentation.slides.getItem(12);
replaceAnyMatching(dataSlide, ["12,960행의 학교 시설 이용 자료", "12,960행의 학교 시설 이용 자료를 사용한다"], "12,960행의 학교 시설 이용 자료를 사용한다");
if (dataSlide.tables.items.length === 0) {
  coverContent(dataSlide);
  const table = dataSlide.tables.add({
    rows: 6,
    columns: 3,
    left: 205,
    top: 205,
    width: 870,
    height: 330,
    columnWidths: [220, 310, 340],
    values: [
      ["열 이름", "뜻", "값의 예"],
      ["date", "날짜", "2026-03-02"],
      ["weekday", "요일", "Monday"],
      ["time_slot", "24시간 형식의 시간대", "08:00"],
      ["facility", "학교 안의 공간", "Computer_Room"],
      ["visitors", "이용 인원", "18"],
    ],
  });
  table.borders.assign({ style: "solid", fill: "#D7DEE3", width: 1 });
  table.cells.block({ row: 0, column: 0, rowCount: 6, columnCount: 3 }).assign({
    fill: "#FFFFFF",
    textStyle: { typeface: "IBM Plex Sans KR", fontSize: 17, color: "#1B1D21" },
    margins: { left: 12, right: 12, top: 7, bottom: 7 },
    anchor: "middle",
  });
  table.cells.block({ row: 0, column: 0, rowCount: 1, columnCount: 3 }).assign({
    fill: "#1B1D21",
    textStyle: { typeface: "IBM Plex Sans KR", fontSize: 18, bold: true, color: "#FFFFFF" },
    anchor: "middle",
  });
  table.cells.block({ row: 1, column: 0, rowCount: 5, columnCount: 1 }).assign({
    fill: "#E8F4F1",
    textStyle: { typeface: "IBM Plex Mono", fontSize: 17, bold: true, color: "#0C7F89" },
  });
  addFooterBand(dataSlide, "facility 값은 영문이고, 두 단어로 된 공간 이름은 밑줄로 이어집니다.", { top: 565, fill: "#EAF4FB", color: "#374151" });
}
dataSlide.speakerNotes.textFrame.setText("[32–35분] 수행평가 데이터\n\n교과서와 같은 표로 다섯 열의 이름, 뜻, 값의 예를 확인한다. time_slot은 24시간 형식이고 facility 값은 영문이며 두 단어는 밑줄로 이어진다. 데이터의 결론은 아직 설명하지 않는다.");

const sequenceSlide = presentation.slides.getItem(13);
if (!sequenceSlide.shapes.items.some((shape) => textOf(shape).includes("선택·계획"))) {
  coverContent(sequenceSlide);
  const stepXs = [55, 355, 655, 955];
  addStepCard(sequenceSlide, { number: 1, title: "자료 파악", body: "어떤 데이터인지와\n행·열의 뜻 확인", left: stepXs[0], top: 225, width: 245, height: 255 });
  addStepCard(sequenceSlide, { number: 2, title: "선택·계획", body: "시각화할 내용과 그래프 선택\nAI의 작업 계획 확인", left: stepXs[1], top: 225, width: 245, height: 255 });
  addStepCard(sequenceSlide, { number: 3, title: "실행", body: "확인한 계획에 따라\n필요한 작업 수행", left: stepXs[2], top: 225, width: 245, height: 255 });
  addStepCard(sequenceSlide, { number: 4, title: "검토·해석", body: "정확성을 확인하고\n그래프를 통해 보이는 내용 기록", left: stepXs[3], top: 225, width: 270, height: 255, accent: true });
  for (const left of [305, 605, 905]) {
    addText(sequenceSlide, "→", { left, top: 315, width: 45, height: 45 }, { fontSize: 30, bold: true, color: "#FF5C00", horizontalAlignment: "center" });
  }
  addFooterBand(sequenceSlide, "AI의 계획이 알맞으면 실행을 승인하고, 부족하면 계획부터 고칩니다.");
}
for (const shape of sequenceSlide.shapes.items) {
  if (textOf(shape) === "자료 이해") shape.text.replace(String(shape.text), "자료 파악");
  if (textOf(shape) === "제작·실행") shape.text.replace(String(shape.text), "실행");
  if (textOf(shape).includes("요약표와 그래프 실행")) {
    shape.text.replace(String(shape.text), "확인한 계획에 따라\n필요한 작업 수행");
  }
  if (textOf(shape).includes("요약표·그래프")) {
    shape.text.replace(String(shape.text), "그래프와 실행 결과");
  }
}
sequenceSlide.speakerNotes.textFrame.setText("[35–39분] AI에게 일을 나누기\n\n교과서와 같은 네 단계로 제시한다. 선택·계획 단계에는 시각화할 내용과 그래프 선택, AI의 작업 계획 확인이 함께 들어간다.");

const reviewSlide = presentation.slides.getItem(14);
replaceAnyMatching(reviewSlide, ["전체를 눈으로 훑지 말고 구조와 요약을 비교한다", "전체를 훑지 않고 자료를 파악한다"], "전체를 훑지 않고 자료를 파악한다");
replaceAnyMatching(reviewSlide, ["묶을 기준", "자료의 내용"], "자료의 내용");
replaceAnyMatching(reviewSlide, ["요일·시간대·시설 등", "행과 열의 의미"], "행과 열의 의미");
replaceAnyMatching(reviewSlide, ["무엇을 볼지 정함", "직접 확인하거나 AI에게 설명 요청"], "직접 확인하거나\nAI에게 설명 요청");
replaceExactAny(reviewSlide, ["요약표", "그래프 선택"], "그래프 선택");
replaceAnyMatching(reviewSlide, ["기준별 값", "무엇을 보여 줄지"], "무엇을 보여 줄지");
replaceAnyMatching(reviewSlide, ["그래프 선택 전 확인", "자료에 알맞은지 확인"], "자료에 알맞은지 확인");
replaceExactAny(reviewSlide, ["그래프", "결과 검토"], "결과 검토");
replaceAnyMatching(reviewSlide, ["요약표와 대조", "원본 자료와 대조"], "원본 자료와 대조");
replaceAnyMatching(reviewSlide, ["요약표를 먼저 확인한 뒤 그 값을 나타낼 그래프를 고릅니다.", "자료를 파악한 뒤, 무엇을 보여 줄지 정하고 알맞은 그래프를 고릅니다."], "자료를 파악한 뒤, 무엇을 보여 줄지 정하고 알맞은 그래프를 고릅니다.");
reviewSlide.speakerNotes.textFrame.setText("[39–42분] 큰 자료 확인\n\n열 이름과 몇 개의 값을 보고 자료가 무엇을 기록한 것인지 파악한다. 학생이 직접 살펴보거나 AI에게 설명을 요청할 수 있다. 무엇을 보고 싶은지 정한 뒤 그 목적에 알맞은 그래프를 고른다.");

const omitSlide = presentation.slides.getItem(8);
textAt(omitSlide, 55.68, 74.88, ".venv와 임시 파일은 공유하지 않는다");
coverContent(omitSlide);
addPanel(omitSlide, { left: 75, top: 215, width: 540, height: 300, fill: "#F1F2F4", lineFill: "#D7DEE3" });
addText(omitSlide, ".venv", { left: 110, top: 250, width: 470, height: 45 }, { fontSize: 28, bold: true, color: "#FF5C00" });
addText(omitSlide, "Python과 라이브러리가 실제로 설치된 폴더", { left: 110, top: 320, width: 470, height: 36 }, { fontSize: 21, bold: true });
addText(omitSlide, "용량이 크고 다른 컴퓨터에서는 그대로 작동하지 않을 수 있습니다.\npyproject.toml과 uv.lock을 읽어 다시 만들 수 있습니다.", { left: 110, top: 385, width: 470, height: 88 }, { fontSize: 18, color: "#555C64" });
addPanel(omitSlide, { left: 665, top: 215, width: 540, height: 300, fill: "#F1F2F4", lineFill: "#D7DEE3" });
addText(omitSlide, "캐시 · 임시 파일", { left: 700, top: 250, width: 470, height: 45 }, { fontSize: 28, bold: true });
addText(omitSlide, "프로그램을 실행하며 자동으로 생기는 파일", { left: 700, top: 320, width: 470, height: 36 }, { fontSize: 21, bold: true });
addText(omitSlide, "없어도 다시 만들어지므로 공유하지 않습니다.\n제출할 사본에서만 빼고 원본 작업 폴더는 그대로 둡니다.", { left: 700, top: 385, width: 470, height: 88 }, { fontSize: 18, color: "#555C64" });
addFooterBand(omitSlide, "5-2에서 제출용 사본을 만든 뒤, 그 사본에서만 .venv와 임시 파일을 뺍니다.", { top: 560 });
omitSlide.speakerNotes.textFrame.setText("[21–23분] 다시 만들 파일\n\n.venv는 다른 컴퓨터에서 그대로 쓰는 폴더가 아니다. 받은 사람은 환경 정보 파일을 바탕으로 uv sync를 실행해 자기 컴퓨터에 맞는 .venv를 만든다. 원본은 건드리지 않고 제출용 사본에서만 제외한다.");

setCardSlide(presentation.slides.getItem(9), {
  title: "프로젝트 파일과 평가용 기록을 구분한다",
  cards: [
    ["함께 공유", "Notebook · CSV\nREADME.md\npyproject.toml"],
    ["상황에 따라 선택", "uv.lock\n\n같은 라이브러리 버전이\n중요할 때 함께 공유"],
    ["보통 공유하지 않음", ".venv · 캐시\n임시 파일\n\n환경 정보로 다시 준비"],
  ],
  footer: "이번 평가에서는 uv.lock과 평가용 OpenCode JSON도 함께 제출합니다.",
  notes: "[23–25분] 공유 파일 정리\n\n앞의 내용을 반복 설명하지 않고 실제 선택 기준만 정리한다. uv.lock은 상황에 따라 선택할 수 있지만 이번 평가에서는 제출한다. OpenCode JSON은 일반 공유물이 아니라 평가용으로 추가한다.",
});

const setupSlide = presentation.slides.getItem(10);
textAt(setupSlide, 55.68, 74.88, "05 폴더를 통째로 열고 환경을 만든다");
coverContent(setupSlide);
addStepCard(setupSlide, { number: 1, title: "압축 풀기", body: "내려받은 ZIP의\n압축을 풉니다.", left: 55, top: 215, width: 218, height: 310, bodyFontSize: 18 });
addStepCard(setupSlide, { number: 2, title: "05 폴더 열기", body: "VS Code에서\n05 폴더 전체를 엽니다.", left: 293, top: 215, width: 218, height: 310, bodyFontSize: 18 });
addStepCard(setupSlide, { number: 3, title: "환경 만들기", body: "uv sync를 직접 실행하거나\nOpenCode에 요청합니다.", left: 531, top: 215, width: 218, height: 310, bodyFontSize: 17 });
addStepCard(setupSlide, { number: 4, title: "Notebook 열기", body: "notebooks 폴더에서\n평가 Notebook을 엽니다.", left: 769, top: 215, width: 218, height: 310, bodyFontSize: 18 });
addStepCard(setupSlide, { number: 5, title: "커널 선택", body: "오른쪽 위에서\n.venv (Python 3)를\n선택합니다.", left: 1007, top: 215, width: 218, height: 310, accent: true, bodyFontSize: 18 });

const textbookPageRefs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12–13", "14", "15", "16", "17", "18"];
for (let index = 5; index < presentation.slides.items.length; index++) {
  const slide = presentation.slides.getItem(index);
  textAt(slide, 1070.4, 82.56, String(index).padStart(2, "0"));
  textAt(slide, 55.68, 664.32, `교과서 05-1 · ${textbookPageRefs[index]}쪽`);
  textAt(slide, 1176, 664.32, String(index + 1).padStart(2, "0"));
}

const laterNotes = [
  "[25–29분] 폴더와 환경 준비\n\n05 폴더 전체를 VS Code로 연다. uv sync는 직접 실행하거나 OpenCode에 맡긴다. 맡길 때는 pip가 아니라 uv를 쓴다고 알려 준다.",
  "[29–32분] Notebook 커널 선택\n\nSelect Kernel을 누른 뒤 Python Environments...를 연다. 목록에 05의 .venv가 보이면 선택한다. 보이지 않으면 Create Python Environment를 누르고 05\\.venv\\Scripts\\python.exe 경로를 선택한다. 마지막에 Notebook 오른쪽 위에 .venv가 표시되는지 확인한다.",
  "[32–35분] 수행평가 데이터\n\n열 이름과 값의 기본 모양만 알려 준다. 이 단계에서 데이터의 결론을 대신 해석해 주지 않는다.",
  "[35–39분] AI에게 일을 나누기\n\n학생이 시각화할 내용을 고른 뒤 AI가 작업 계획을 먼저 제시하게 한다. 계획이 목표에 맞으면 승인하고, 부족하면 계획부터 고친다.",
  "[39–42분] 큰 자료 확인\n\n열 이름과 몇 개의 값을 보고 자료가 무엇을 기록한 것인지 파악한다. 학생이 직접 살펴보거나 AI에게 설명을 요청할 수 있다. 무엇을 보고 싶은지 정한 뒤 그 목적에 알맞은 그래프를 고른다.",
  "[42–44분] AI 대화 기록\n\n완성한 Notebook과 함께 AI 대화 기록도 JSON으로 제출한다는 점만 안내한다. 추출 요청과 확인 방법은 수행평가가 끝난 뒤 5-2에서 다룬다.",
  "[44–45분] 다음 차시 전 점검\n\n05 폴더, uv sync, .venv 커널, CSV, 네 단계, 그래프 출력 후 Notebook 저장, AI 대화 기록, Google 계정 로그인을 확인한다. 준비되지 않은 항목은 수행평가 전에 해결한다.",
];
for (let i = 0; i < laterNotes.length; i++) {
  presentation.slides.getItem(10 + i).speakerNotes.textFrame.setText(laterNotes[i]);
}

const evidenceSlide = presentation.slides.getItem(15);
replaceAnyMatching(evidenceSlide, ["AI와 나눈 대화도 함께 제출한다", "이번 평가에서는 AI 대화도 함께 제출한다"], "이번 평가에서는 AI 대화도 함께 제출한다");
replaceAnyMatching(evidenceSlide, ["OpenCode JSON · 평가용", "OpenCode JSON"], "OpenCode JSON · 평가용");
replaceAnyMatching(evidenceSlide, ["추출 방법은 5-2에서 확인", "이번 평가에서만 추가"], "이번 평가에서만 추가");
replaceAnyMatching(evidenceSlide, ["지금은 두 기록을 함께 제출한다는 점만 확인합니다.", "일반 프로젝트 공유에는 보통 포함하지 않습니다.", "일반 공유에는 보통 넣지 않으며"], "일반 공유에는 보통 넣지 않으며, 추출 방법은 5-2에서 확인합니다.");
replaceAnyMatching(evidenceSlide, ["코드·요약표·그래프와 검토·해석 내용", "코드·그래프와 검토·해석 내용", "코드·그래프·검토 내용"], "코드·그래프·검토 내용");
evidenceSlide.speakerNotes.textFrame.setText("[42–44분] 평가용 AI 대화 기록\n\nOpenCode 대화 JSON은 일반 프로젝트 공유 파일이 아니다. 이번 수행평가에서 AI 활용 과정을 확인하기 위해서만 추가로 제출하며, 추출 방법은 5-2에서 안내한다.");

const finalCheckSlide = presentation.slides.getItem(16);
replaceAnyMatching(finalCheckSlide, ["시작할 준비가 되었는지 점검한다", "다음 시간에 사용할 환경을 확인한다"], "다음 시간에 사용할 환경을 확인한다");
if (!finalCheckSlide.shapes.items.some((shape) => textOf(shape).includes("CSV 파일 확인"))) {
  coverContent(finalCheckSlide);
  addStepCard(finalCheckSlide, { number: 1, title: "05 폴더", body: "VS Code에서\n폴더 전체를 열었다", left: 55, top: 225, width: 270, height: 240 });
  addStepCard(finalCheckSlide, { number: 2, title: "uv sync", body: "명령이 끝나고\n.venv가 만들어졌다", left: 355, top: 225, width: 270, height: 240 });
  addStepCard(finalCheckSlide, { number: 3, title: ".venv 커널", body: "Notebook 오른쪽 위에서\n05의 .venv를 골랐다", left: 655, top: 225, width: 270, height: 240 });
  addStepCard(finalCheckSlide, { number: 4, title: "CSV 파일 확인", body: "data 폴더에\n제공된 CSV가 있다", left: 955, top: 225, width: 270, height: 240, accent: true });
  addFooterBand(finalCheckSlide, "이 네 항목이 준비되면 다음 차시에 수행평가를 시작할 수 있습니다.");
}
const finalCheckHeading = finalCheckSlide.shapes.items.find((shape) => textOf(shape).includes("CSV · 네 단계"));
if (finalCheckHeading) finalCheckHeading.text.replace(String(finalCheckHeading.text), "");
finalCheckSlide.speakerNotes.textFrame.setText("[44–45분] 다음 차시 전 환경 확인\n\n5-2의 평가 과정이나 제출 점검을 미리 넣지 않는다. 05 폴더, uv sync, .venv 커널, 제공된 CSV까지 실제 실행 준비만 확인한다.");

const kernelSlide = presentation.slides.getItem(11);
const kernelBytes = new Uint8Array(await fs.readFile(path.join(workspaceDir, "assets/img/05-1-01-select-kernel.png")));
const existingKernelImage = kernelSlide.images.items[0];
if (existingKernelImage) {
  existingKernelImage.replace({
    blob: kernelBytes,
    contentType: "image/png",
    alt: "Windows용 VS Code에서 Select Kernel을 누르고 Python Environments의 .venv를 선택하는 화면",
  });
  existingKernelImage.frame = { left: 277.5, top: 196.8, width: 725, height: 408 };
} else {
  kernelSlide.images.add({
    blob: kernelBytes,
    contentType: "image/png",
    alt: "Windows용 VS Code에서 Select Kernel을 누르고 Python Environments의 .venv를 선택하는 화면",
    fit: "contain",
    position: { left: 277.5, top: 196.8, width: 725, height: 408 },
  });
}

const removedSlidePhrases = [
  "OpenCode: uv sync",
  "pip 금지",
  "큰 중간 결과물",
  "원본 CSV와 Notebook으로",
  "Notebook 출력은",
  "다음 화면에서 Notebook이 사용할",
];
for (const slide of presentation.slides.items) {
  for (const shape of slide.shapes.items) {
    if (!shape.text) continue;
    if (removedSlidePhrases.some((phrase) => textOf(shape).includes(phrase))) {
      shape.text.replace(String(shape.text), "");
    }
  }
}

normalizeFonts(presentation);
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);
await finalizePresentation({
  workspaceDir,
  candidatePath,
  finalPath: checkedPath,
  pythonExecutable,
  integrityValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: [
    "--expected-slide-size-emu", "12191695,6858000",
    "--validate-bullet-geometry",
    "--validate-heading-fit",
    "--require-native-table-slide", "13",
  ],
  explicitTotalSlideCount: 17,
  requiredNativeTableOwnerSlides: [13],
  requiredNativeChartOwnerSlides: [],
  fontPolicy: {
    basis: "reference",
    families: ["IBM Plex Sans KR", "IBM Plex Mono"],
    referencePath: sourcePath,
    referenceSha256: sourceSha256,
  },
  verifyArtifactToolImport: true,
  receiptPath,
});

await fs.copyFile(checkedPath, sourcePath);
console.log(`Updated ${sourcePath}`);

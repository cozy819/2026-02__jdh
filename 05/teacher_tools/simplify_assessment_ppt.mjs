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
const sharpModule = await importRuntimeModule("sharp");
const sharp = sharpModule.default ?? sharpModule;

const sourcePath = path.join(workspaceDir, "05/ppt/05-2_수행평가_1_실시와_제출.pptx");
const stagingDir = path.join(workspaceDir, ".codex-finalizer/week05-ppt-final");
const buildTag = `05-2-${Date.now()}`;
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

function normalizedTextOf(shape) {
  return textOf(shape).normalize("NFC");
}

function setShapeText(shape, value) {
  if (!shape?.text) throw new Error("Text shape not found");
  shape.text.replace(String(shape.text), value.normalize("NFC"));
}

function setTextAt(slide, left, top, value, tolerance = 3) {
  const shape = slide.shapes.items.find((item) =>
    item.text &&
    Math.abs(item.position.left - left) <= tolerance &&
    Math.abs(item.position.top - top) <= tolerance
  );
  if (!shape) throw new Error(`Text shape not found near ${left},${top}`);
  setShapeText(shape, value);
}

function replaceMatching(slide, match, value) {
  const shape = slide.shapes.items.find((item) => textOf(item).includes(match));
  if (!shape) throw new Error(`Text not found: ${match}`);
  shape.text.replace(String(shape.text), value.normalize("NFC"));
}

function addText(slide, value, position, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position,
    fill: "none",
    line: { fill: "none", width: 0 },
  });
  shape.text = value.normalize("NFC");
  shape.text.style = {
    typeface: "IBM Plex Sans KR",
    fontSize: 22,
    color: "#1B1D21",
    autoFit: "shrinkText",
    ...style,
  };
  return shape;
}

function normalizeFonts(deck) {
  for (const slide of deck.slides.items) {
    for (const shape of slide.shapes.items) {
      if (!shape.text) continue;
      const originalText = String(shape.text);
      const normalizedText = originalText.normalize("NFC");
      if (originalText !== normalizedText) {
        shape.text.replace(originalText, normalizedText);
      }
      if (!shape.text?.style) continue;
      const current = { ...shape.text.style };
      const typeface = current.typeface === "IBM Plex Mono" ? "IBM Plex Mono" : "IBM Plex Sans KR";
      shape.text.style = { ...current, typeface };
    }
  }
}

// Cover, an after-assessment divider, and four real notebook outputs.
if (presentation.slides.items.length === 11) {
  presentation.slides.keep([0, 6, 7, 8, 9, 10]);
} else if (presentation.slides.items.length === 7) {
  presentation.slides.keep([0, 2, 3, 4, 5, 6]);
} else if (presentation.slides.items.length !== 6) {
  throw new Error(`Expected 11 source slides, 7 revised slides, or 6 final slides; found ${presentation.slides.items.length}`);
}

const coverSlide = presentation.slides.getItem(0);
const coverSubtitle = coverSlide.shapes.items.find((shape) => {
  const value = normalizedTextOf(shape);
  return value.includes("준비를 확인한 뒤") || value.includes("교과서 5-2를 참고로");
});
if (!coverSubtitle) throw new Error("Cover subtitle not found");
setShapeText(coverSubtitle, "교과서 5-2를 참고로 수행평가를 진행합니다.");
coverSlide.speakerNotes.textFrame.setText("교과서 5-2를 참고로 학생이 수행평가를 진행한다.");

const dividerSlide = presentation.slides.getItem(1);
if (!dividerSlide.shapes.items.some((shape) => normalizedTextOf(shape).includes("\uac19\uc740 \uc790\ub8cc\ub97c"))) {
dividerSlide.shapes.add({
  geometry: "rect",
  position: { left: 0, top: 0, width: 1280, height: 720 },
  fill: "#1B1D21",
  line: { fill: "none", width: 0 },
});
dividerSlide.shapes.add({
  geometry: "rect",
  position: { left: 0, top: 0, width: 18, height: 720 },
  fill: "#FF5C00",
  line: { fill: "none", width: 0 },
});
addText(dividerSlide, "평가 종료 후", { left: 86, top: 188, width: 360, height: 34 }, {
  fontSize: 20, color: "#B9BEC5", bold: true,
});
addText(dividerSlide, "같은 자료를\n다르게 본다", { left: 86, top: 248, width: 780, height: 145 }, {
  fontSize: 48, color: "#FFFFFF", bold: true,
});
addText(dividerSlide, "학생이 사용한 것과 같은 CSV를 Notebook에서 실제로 실행해 만든 결과입니다.", {
  left: 88, top: 430, width: 880, height: 44,
}, {
  fontSize: 22, color: "#D7DBE0",
});
}
dividerSlide.speakerNotes.textFrame.setText("수행평가가 모두 끝난 뒤에만 보여 준다. 같은 자료도 무엇을 보려고 하느냐에 따라 다른 그래프가 될 수 있음을 확인한다.");
setTextAt(dividerSlide, 86, 188, "\ud3c9\uac00 \uc885\ub8cc \ud6c4");
setTextAt(dividerSlide, 86, 248, "\uac19\uc740 \uc790\ub8cc\ub97c\n\ub2e4\ub974\uac8c \ubcf8\ub2e4");

const chartNames = [
  "05-2-02-time-slot-average.png",
  "05-2-03-facility-share.png",
  "05-2-04-weekday-average.png",
  "05-2-05-weekday-time-heatmap.png",
];
const chartNotes = [
  "수행평가 종료 후 예시. 시간대별 평균 이용 인원을 연결하면 하루 안의 변화가 보인다.",
  "수행평가 종료 후 예시. 장소별 전체 이용 인원을 비율로 나누어 본 결과이다.",
  "수행평가 종료 후 예시. 요일별 평균을 비교하면 금요일의 반복되는 차이가 보인다.",
  "수행평가 종료 후 예시. 요일과 시간대를 함께 보면 언제 이용자가 몰리는지 더 구체적으로 보인다.",
];
const chartTypes = [
  "\uaebe\uc740\uc120\uadf8\ub798\ud504",
  "\uc6d0\uadf8\ub798\ud504",
  "\ub9c9\ub300\uadf8\ub798\ud504",
  "\uc0c9\uc73c\ub85c \ub098\ud0c0\ub0b8 \ud45c",
];
const chartTitles = [
  "시간대별 평균 이용 인원",
  "장소별 이용 인원 비율",
  "요일별 평균 이용 인원",
  "요일과 시간대를 함께 본 이용 패턴",
];
const chartSubtitles = [
  "하루 동안 이용 인원이 어떻게 달라지는지 본다",
  "전체 이용에서 각 장소가 차지하는 몫을 본다",
  "요일마다 반복되는 이용 차이를 비교한다",
  "두 기준을 겹쳐 보면 붐비는 때가 더 구체적으로 보인다",
];
const chartTitleFontSizes = [34, 34, 34, 30];
const chartTitleLefts = [55, 55, 55, 70];
const chartCropTops = [205, 205, 205, 230];
const chartExplanations = [
  "시간대별 평균 이용 인원을\n계산했습니다.\n\n시간의 흐름에 따라 값이\n어떻게 달라지는지 보려고\n선으로 연결했습니다.",
  "장소마다 이용 인원을\n모두 더했습니다.\n\n전체에서 각 장소가 차지하는\n비율을 비교하려고\n원으로 나누었습니다.",
  "요일마다 평균 이용 인원을\n계산했습니다.\n\n요일 사이의 크기 차이를 보려고\n막대 높이로 비교했습니다.",
  "요일과 시간대를 묶어\n평균 이용 인원을 계산했습니다.\n\n값이 클수록 진한 색으로 표시해\n붐비는 때를 찾았습니다.",
];
for (let i = 0; i < chartNames.length; i += 1) {
  const slide = presentation.slides.getItem(2 + i);
  for (const shape of [...slide.shapes.items]) shape.delete();
  for (const image of [...slide.images.items]) image.delete();
  const sourceChartBytes = await fs.readFile(path.join(workspaceDir, "assets/img", chartNames[i]));
  const bytes = new Uint8Array(
    await sharp(sourceChartBytes)
      .extract({ left: 0, top: chartCropTops[i], width: 1600, height: 900 - chartCropTops[i] })
      .png()
      .toBuffer()
  );
  slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 0, width: 1280, height: 720 },
    fill: "#FFFFFF",
    line: { fill: "none", width: 0 },
  });
  addText(slide, chartTitles[i], { left: chartTitleLefts[i], top: 56, width: 915, height: 50 }, {
    fontSize: chartTitleFontSizes[i], bold: true, color: "#1B1D21",
  });
  addText(slide, chartSubtitles[i], { left: 56, top: 112, width: 930, height: 32 }, {
    fontSize: 20, color: "#69707A",
  });
  slide.shapes.add({
    geometry: "rect",
    position: { left: 56, top: 160, width: 68, height: 4 },
    fill: "#FF5C00",
    line: { fill: "none", width: 0 },
  });
  slide.images.add({
    blob: bytes,
    contentType: "image/png",
    alt: "실제 수행평가 CSV를 Notebook에서 실행해 만든 그래프",
    fit: "contain",
    position: { left: 55, top: 195, width: 835, height: 420 },
  });
  slide.shapes.add({
    geometry: "roundRect",
    position: { left: 930, top: 195, width: 305, height: 420 },
    fill: "#F1F2F4",
    line: { fill: "#D7DEE3", width: 1.2 },
  });
  addText(slide, "\uadf8\ub798\ud504\ub97c \ub9cc\ub4e0 \ubc29\ubc95", { left: 958, top: 225, width: 250, height: 28 }, {
    fontSize: 17, bold: true, color: "#69707A",
  });
  addText(slide, chartTypes[i], { left: 958, top: 265, width: 250, height: 40 }, {
    fontSize: 25, bold: true, color: "#FF5C00",
  });
  addText(slide, chartExplanations[i], { left: 950, top: 322, width: 270, height: 250 }, {
    fontSize: 18, color: "#1B1D21",
  });
  slide.shapes.add({
    geometry: "roundRect",
    position: { left: 1085, top: 28, width: 150, height: 36 },
    fill: "#1B1D21",
    line: { fill: "none", width: 0 },
  });
  addText(slide, "\ud3c9\uac00 \uc885\ub8cc \ud6c4", { left: 1098, top: 34, width: 124, height: 23 }, {
    fontSize: 16, bold: true, color: "#FFFFFF", horizontalAlignment: "center",
  });
  addText(slide, String(3 + i).padStart(2, "0"), { left: 1180, top: 670, width: 55, height: 20 }, {
    fontSize: 12, color: "#69707A", horizontalAlignment: "right",
  });
  slide.speakerNotes.textFrame.setText(chartNotes[i]);
}

const removedInstructionPhrases = ["2쪽부터", "이전 쪽의 확인", "제출 완료 화면", "질문"];
for (const slide of presentation.slides.items) {
  for (const shape of slide.shapes.items) {
    if (!shape.text) continue;
    if (removedInstructionPhrases.some((phrase) => normalizedTextOf(shape).includes(phrase))) {
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
  ],
  explicitTotalSlideCount: 6,
  requiredNativeTableOwnerSlides: [],
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

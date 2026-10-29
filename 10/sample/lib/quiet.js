// node:sqlite 를 불러올 때 나오는 「실험 기능」 경고 한 줄을 감춘다. 수업과 관계없는 경고다.
const emit = process.emitWarning;
process.emitWarning = (w, ...rest) => (String(w).includes("SQLite") ? undefined : emit.call(process, w, ...rest));

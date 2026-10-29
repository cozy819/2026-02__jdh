// SQLite 연결 — 11회부터 쓴다. 기록은 data/app.db 파일 하나에 저장된다.
// 연결 부분은 선생님이 정해 둔 것이다. 표(테이블)를 만드는 문장만 내 서비스에 맞게 더한다.
import "./quiet.js";
import { DatabaseSync } from "node:sqlite"; // Node에 들어 있는 SQLite. 따로 설치할 패키지가 없다.
import path from "node:path";
import fs from "node:fs";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "app.db");

let db;

export function getDb() {
  if (!db) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    db = new DatabaseSync(DB_PATH);
    // 내 서비스의 표를 여기서 만든다. 이미 있으면 그대로 둔다. (11회)
    // 예) db.exec(`CREATE TABLE IF NOT EXISTS 표이름 ( id INTEGER PRIMARY KEY AUTOINCREMENT, ... )`);
  }
  return db;
}

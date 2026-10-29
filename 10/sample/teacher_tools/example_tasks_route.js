import { getDb } from "@/lib/db";
function db() {
  const d = getDb();
  d.exec(`CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)`);
  return d;
}
export async function GET() {
  return Response.json({ ok: true, items: db().prepare("SELECT * FROM tasks ORDER BY id DESC").all() });
}
export async function POST(request) {
  const { text } = await request.json();
  if (!String(text ?? "").trim()) return Response.json({ ok: false, message: "할 일을 입력하세요." }, { status: 400 });
  db().prepare("INSERT INTO tasks (text) VALUES (?)").run(String(text).trim());
  return Response.json({ ok: true, message: "추가했습니다." });
}

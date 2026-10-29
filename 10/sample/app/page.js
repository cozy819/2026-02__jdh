"use client";
// 화면 — 사용자가 보고, 입력하고, 버튼을 누르는 곳이다.
// 버튼을 누르면 /api/check 로 요청을 보내고, 돌아온 응답을 화면에 보여 준다.
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setResult("");
    setError("");
    try {
      // ① 요청: 어디로(/api/check), 어떻게(POST), 무엇을({ text })
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      // ② 응답: { ok, message }
      const data = await res.json();
      if (data.ok) setResult(data.message);
      else setError(data.message);
    } catch {
      setError("서비스에 연결하지 못했습니다. 잠시 뒤 다시 눌러 주세요.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <h1>내 서비스</h1>
      <p className="desc">글자를 입력하고 확인을 누르면, 서비스가 받은 글자를 돌려줍니다.</p>
      <form onSubmit={handleSubmit}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="여기에 입력" />
        <button disabled={sending}>{sending ? "보내는 중" : "확인"}</button>
      </form>
      {result && <p className="result">{result}</p>}
      {error && <p className="error">{error}</p>}
    </main>
  );
}

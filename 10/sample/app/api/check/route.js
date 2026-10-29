// API — 화면이 보낸 요청을 받아 처리하고 응답을 돌려주는 창구다.
// 주소: /api/check   방법: POST   보낼 것: { text }   돌려줄 것: { ok, message }

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "요청을 읽지 못했습니다." }, { status: 400 });
  }
  const text = String(body?.text ?? "").trim();

  // 입력 문제: 무엇을 고쳐야 하는지 알려 준다.
  if (!text) {
    return Response.json({ ok: false, message: "글자를 입력하세요." }, { status: 400 });
  }

  // 성공: 처리한 결과를 돌려준다.
  return Response.json({ ok: true, message: `받은 글자: ${text}` });
}

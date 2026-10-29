# 표준 프로젝트 규칙 (10~13회)

이 폴더는 중·고등학생이 AI와 함께 만드는 웹서비스 프로젝트다. 학생은 코드를 처음부터 쓰지 않고,
AI가 만든 결과를 실행하고 확인하고 고쳐 달라고 요청한다.

## 먼저 읽을 파일

- `docs/00_course_rules.md` — 수업에서 만들 수 있는 것과 어려운 것
- `docs/PRD.md` — 학생의 서비스 계획서
- `docs/09_development_plan.md` — 학생이 확정한 사용자 흐름과 10~13회 개발 순서
- `docs/10_api_promise.md` — 핵심 행동의 API 약속(10회부터)
- `docs/12_test_record.md` — 사용자 흐름 테스트 기록(12회부터)

## 프로젝트 구조 (바꾸지 않는다)

- 화면: `app/page.js` (필요하면 `app` 안에 화면 파일을 더 만든다)
- API: `app/api/<이름>/route.js` — 화면은 `fetch`로 이 주소에 요청하고 JSON 응답을 받는다
- 데이터: `lib/db.js`의 `getDb()` — Node 내장 SQLite, 기록 파일은 `data/app.db`
- 실행: `npm run dev` → http://localhost:3000
- 언어: JavaScript. TypeScript로 바꾸지 않는다.

## 지킬 일

- 새 패키지를 설치하지 않는다. `package.json`, `next.config.mjs`, `scripts/` 는 고치지 않는다.
- 프로젝트 전체를 다시 만들지 않는다. 요청받은 파일과 부분만 고친다.
- 고치기 전에 무엇을 어느 파일에서 왜 고칠지 먼저 쉬운 말로 설명한다. 학생이 「진행해」라고 하면 고친다.
- 외부 AI·로그인·외부 DB·결제·외부 API를 쓰지 않는다. 필요해 보이면 `docs/00_course_rules.md`의 대안을 제안한다.
- `docs/` 안의 문서는 고치지 않는다. 고칠 곳이 보이면 대화창에 알려만 준다.
- 화면에 보이는 글은 한국어로 쓴다. 응답 JSON은 `{ ok: true/false, message, ... }` 모양을 지킨다.
- 실패 응답에는 사용자가 무엇을 고쳐 다시 하면 되는지 적는다.
- 학생은 Windows를 쓴다. 터미널 명령을 알려 줄 때는 PowerShell 기준으로 쓴다.
- 답은 한국어로 짧게 한다.

## 대화 기록

- 학생이 말할 때마다, 답하기 전에 `AI대화기록.md` 맨 아래에
  「내가 보낸 말(그대로)」「네 답 요약」「고친 파일(없으면 없음)」을 덧붙인다.
  `AI대화기록.md`가 없으면 만든다.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

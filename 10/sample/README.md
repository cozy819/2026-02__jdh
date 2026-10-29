# 내 서비스 프로젝트 (10~13회)

## 처음 한 번 (10-2)

1. VS Code에서 `파일 → 폴더 열기`로 이 `10` 폴더 자체를 연다.
2. 터미널 → 새 터미널을 열고 줄 끝이 `…\10>` 인지 본다.
3. `npm install` 을 입력한다. 몇 분 걸린다. 끝나면 `node_modules` 폴더가 생긴다.

## 실행할 때마다

1. 터미널에 `npm run dev` 를 입력한다.
2. `Ready` 가 보이면 브라우저에서 http://localhost:3000 을 연다.
3. 멈출 때는 터미널을 누르고 `Ctrl+C`.

OpenCode는 **다른 터미널**을 하나 더 열어서 켠다. 실행 중인 터미널에서는 켜지 않는다.

## 폴더

| 위치 | 하는 일 |
|---|---|
| `app/page.js` | 화면 |
| `app/api/…/route.js` | API — 요청을 받아 응답한다 |
| `lib/db.js` | SQLite 연결 (11회부터) |
| `data/app.db` | 저장된 기록 (11회에 생긴다) |
| `docs/` | AI가 먼저 읽는 자료 — 수업 조건 · PRD · 개발 계획 · 테스트 기록 |
| `AGENTS.md` | OpenCode가 켤 때마다 먼저 읽는 규칙 |

`package.json` · `next.config.mjs` · `scripts/` 는 선생님이 정해 둔 파일이라 고치지 않는다.

## 제출 ZIP (12~13회)

`npm run pack` 을 입력하면 이 폴더 바깥에 `submit.zip` 이 생긴다. `node_modules` 와 `.next` 는 빠진다.

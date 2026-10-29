# 교사용 (학생 ZIP에 들어가지 않는다)

- `example_tasks_route.js` — 11회 시범용. `app/api/tasks/route.js`로 복사하면 할 일을 SQLite에 저장·조회하는 API가 된다.
  2026-10-29 선생님 Mac(Node 24.13 · Next 16.4.3)에서 저장 → 서버 재시작 → 다시 조회까지 확인했다.

## 템플릿 확인 기록 (2026-10-29 · macOS)

- `npm install` → node_modules 약 350MB. 학교 네트워크에서 시간이 걸릴 수 있으니 10-2 시작 직후 바로 시킨다.
- `npm run dev` → http://localhost:3000 · `/api/check` 정상·빈 입력 응답 확인.
- `next dev`가 AGENTS.md 끝에 Next.js 문서 안내 블록을 덧붙인다(16.4부터). 템플릿에 미리 넣어 두었다.
- `npm run pack` → 바깥 폴더에 submit.zip (node_modules·.next 제외, data/app.db 포함).

## 학교 Windows PC에서 한 번 더 확인할 것

- [ ] `node --version` 이 22.13 이상인가 (node:sqlite 필요). 24 LTS 권장.
- [ ] `npm install` 이 학교 네트워크에서 끝나는가, 걸리는 시간.
- [ ] `npm run pack` 의 tar 가 ZIP을 만들고, 한글 파일 이름(AI대화기록.md)이 탐색기에서 깨지지 않는가.
- [ ] VS Code 확장 SQLite Viewer(qwtel.sqlite-viewer)로 data/app.db 가 열리는가.

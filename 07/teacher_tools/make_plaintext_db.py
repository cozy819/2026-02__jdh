"""7-2 2쪽 시연용 — 비밀번호를 평문으로 저장한 회원 DB 예시를 만든다.

교사가 DataGrip으로 이 파일을 열어, 개발자는 DB 안을 아주 쉽게 들여다볼 수 있다는 것과
평문으로 저장하면 비밀번호가 그대로 보인다는 것을 보여 준다. 학생 배포 ZIP에는 넣지 않는다.
이름·아이디·전화번호는 모두 지어낸 값이다(전화번호는 쓰지 않는 010-0000 대역).

실행:  python3 make_plaintext_db.py   → 같은 폴더에 07-2_평문비밀번호_예시.sqlite
"""
import sqlite3
from pathlib import Path

OUT = Path(__file__).with_name('07-2_평문비밀번호_예시.sqlite')
ROWS = [
    ('minjun07', 'mypw123', '김민준', '010-0000-1234', '2026-03-02 08:41'),
    ('seoyeon_lee', 'seoyeon!2026', '이서연', '010-0000-5678', '2026-03-05 19:12'),
    ('jiho.park', 'qwerty1234', '박지호', '010-0000-9012', '2026-04-11 21:30'),
    ('haeun22', 'iloveyou', '최하은', '010-0000-3456', '2026-05-20 07:58'),
    ('doyun_k', '19990101', '강도윤', '010-0000-7890', '2026-06-14 16:03'),
]

OUT.unlink(missing_ok=True)
con = sqlite3.connect(OUT)
con.executescript('''
CREATE TABLE members (
    id         INTEGER PRIMARY KEY,
    login_id   TEXT NOT NULL UNIQUE,
    password   TEXT NOT NULL,   -- 평문 그대로 저장한 나쁜 예
    name       TEXT NOT NULL,
    phone      TEXT,
    joined_at  TEXT NOT NULL
);
''')
con.executemany('INSERT INTO members (login_id, password, name, phone, joined_at) VALUES (?, ?, ?, ?, ?)', ROWS)
con.commit()
con.close()
print('작성:', OUT)

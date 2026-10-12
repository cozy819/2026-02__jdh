"""7-2 2~4쪽 시연용 — 비밀번호 저장 예시 DB 하나에 표 두 개를 만든다. 학생 배포 ZIP에는 넣지 않는다.

파일: 07-2_비밀번호_저장_예시.sqlite
- members_plain  : password 열에 비밀번호가 그대로(평문) 있다. 나쁜 예. (2쪽에서 연다)
- members_hashed : password_hash 열에 단방향 암호화(SHA-256) 결과만 있다. (4쪽에서 연다)

교사가 DataGrip으로 이 파일을 열고 두 표를 차례로 보여 준다.
- 평문 표는 비밀번호가 그대로 보인다.
- 암호화 표는 알아볼 수 없는 값만 보이고, 같은 비밀번호(qwerty1234)를 쓴 두 사람은 결과도 똑같다.
  교과서·PPT의 mypw123 → 989e0d…, mypw124 → c98252… 는 이 표의 실제 값이다.
- 수업 설명을 위해 salt 없이 SHA-256만 썼다. 실제 서비스는 bcrypt처럼 salt를 붙이는 방식을 쓴다(PPT 노트 참고).
이름·아이디·전화번호는 모두 지어낸 값이다(전화번호는 쓰지 않는 010-0000 대역).

실행:  python3 make_plaintext_db.py
"""
import hashlib
import sqlite3
from pathlib import Path

HERE = Path(__file__).parent
ROWS = [
    ('minjun07', 'mypw123', '김민준', '010-0000-1234', '2026-03-02 08:41'),
    ('seoyeon_lee', 'seoyeon!2026', '이서연', '010-0000-5678', '2026-03-05 19:12'),
    ('jiho.park', 'qwerty1234', '박지호', '010-0000-9012', '2026-04-11 21:30'),
    ('haeun22', 'iloveyou', '최하은', '010-0000-3456', '2026-05-20 07:58'),
    ('doyun_k', 'qwerty1234', '강도윤', '010-0000-7890', '2026-06-14 16:03'),
]


OUT = HERE / '07-2_비밀번호_저장_예시.sqlite'
OUT.unlink(missing_ok=True)
con = sqlite3.connect(OUT)


def build(table, pw_col, comment, to_value):
    con.executescript(f'''
CREATE TABLE {table} (
    id         INTEGER PRIMARY KEY,
    login_id   TEXT NOT NULL UNIQUE,
    {pw_col:<10} TEXT NOT NULL,   -- {comment}
    name       TEXT NOT NULL,
    phone      TEXT,
    joined_at  TEXT NOT NULL
);''')
    con.executemany(f'INSERT INTO {table} (login_id, {pw_col}, name, phone, joined_at) VALUES (?, ?, ?, ?, ?)',
                    [(a, to_value(p), n, ph, j) for a, p, n, ph, j in ROWS])


build('members_plain', 'password', '평문 그대로 저장한 나쁜 예', lambda p: p)
build('members_hashed', 'password_hash', '단방향 암호화(SHA-256) 결과만 저장',
      lambda p: hashlib.sha256(p.encode('utf-8')).hexdigest())
con.commit()
con.close()
print('작성:', OUT)

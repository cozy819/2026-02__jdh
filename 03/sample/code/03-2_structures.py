"""3-2 대체 실행 파일 — Notebook을 열지 못할 때 사용합니다.

VS Code에서 이 파일을 열고 오른쪽 위 ▶ Run Python File 을 누릅니다.
코드는 고치지 않습니다. 출력만 읽습니다.
"""

# 1. list — 순서로 묶기
scores = [72, 85, 90, 68]
print("scores      :", scores)

# 2. 번호로 값 꺼내기 — 맨 앞에서 몇 칸 떨어졌는가
print("scores[0]   :", scores[0])
print("scores[1]   :", scores[1])
print("scores[2]   :", scores[2])
print("scores[3]   :", scores[3])

# 3. 없는 자리를 부르면 — 오류가 나는 것이 정상입니다.
#    값이 4개이므로 마지막 번호는 3입니다. 4번은 없는 자리입니다.
try:
    print(scores[4])
except IndexError as e:
    print("scores[4]   : 오류 —", e)
    print("              (list index out of range = 범위를 벗어난 번호)")

# 4. dict — 이름으로 찾기
student = {
    "name": "민준",
    "score": 85,
    "passed": True,
}
print("student     :", student)
print("이름        :", student["name"])
print("점수        :", student["score"])

# 5. 나를 이름표 묶음으로
me = {
    "name": "민준",
    "grade": 1,
    "club": "밴드",
    "favorite_subject": "음악",
}
print("동아리      :", me["club"])

# 6. 여러 명 — 이름표 묶음이 여러 개 늘어서면 표가 된다
students = [
    {"name": "민준", "club": "밴드"},
    {"name": "서연", "club": "미술"},
]
print("첫 번째     :", students[0])
print("두 번째 동아리:", students[1]["club"])

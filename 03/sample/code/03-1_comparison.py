"""3-1 대체 실행 파일 — Notebook을 열지 못할 때 사용합니다.

VS Code에서 이 파일을 열고 오른쪽 위 ▶ Run Python File 을 누릅니다.
코드는 고치지 않습니다. 출력만 읽습니다.

각 묶음을 실행하기 전에 결과를 먼저 예상해 보세요.
"""

# 1. 계산과 비교는 결과의 종류가 다르다
score = 72

print("score + 10  :", score + 10)
print("score >= 60 :", score >= 60)
# 위는 숫자, 아래는 True 또는 False 입니다.
# 계산은 값을 만들고, 비교는 판단을 만듭니다.

# 2. 여섯 가지 비교
print()
print("8 > 5   :", 8 > 5)
print("8 < 5   :", 8 < 5)
print("8 >= 8  :", 8 >= 8)
print("8 <= 7  :", 8 <= 7)
print("8 == 8  :", 8 == 8)
print("8 != 5  :", 8 != 5)

# 3. 경계값 — 정확히 기준에 걸린 사람
#    60점 이상 이라는 같은 기준에 59, 60, 61 을 넣어 봅니다.
print()
passing_score = 60

print("59 >= 60 :", 59 >= passing_score)
print("60 >= 60 :", 60 >= passing_score)
print("61 >= 60 :", 61 >= passing_score)
# 가운데 줄이 이 차시의 핵심입니다. 정확히 60점인 사람도 통과입니다.

# 4. 기호 하나가 한 사람을 가른다
print()
print("60 >  60 :", 60 > 60)
print("60 >= 60 :", 60 >= passing_score)

# 5. 코드가 같아도 기준이 바뀌면 판단이 바뀐다
#    기온은 27도로 같습니다. 기준만 다릅니다.
print()
current_temperature = 27

standard_temperature = 25
print("27 >= 25 :", current_temperature >= standard_temperature)

standard_temperature = 30
print("27 >= 30 :", current_temperature >= standard_temperature)
# 코드가 정확해도 기준이 틀리면 판단이 틀립니다.

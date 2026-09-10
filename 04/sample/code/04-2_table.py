"""4-2 대체 실행 파일 — Notebook을 열지 못할 때 사용합니다.

VS Code에서 이 파일을 열고 오른쪽 위 ▶ Run Python File 을 누릅니다.
터미널에서 돌려도 됩니다:  uv run python code/04-2_table.py

Notebook과 다른 점은 이것뿐입니다.
  · 표가 예쁜 칸 대신 **글자 표**로 나옵니다. 값과 열 이름은 똑같습니다.
  · 그래프는 **별도 창**으로 뜹니다. 커널을 다시 시작할 필요가 없습니다.

코드는 고치지 않습니다. 출력만 읽습니다.
"""
# [검사] 수업 중에 설치하는 라이브러리를 쓴다 — 이 파일은 문법만 본다.
# 이 파일은 04-2_pandas_table.ipynb 에서 만들어 냅니다. 직접 고치지 않습니다.

# ── 1. 3-2에서 만든 이름표 묶음 ──────────────────────────────────────────
data = {
    "day": ["Mon", "Tue", "Wed", "Thu", "Fri"],
    "visitors": [18, 25, 21, 32, 29],
}

print(data)

# ── 2. 표를 다루는 도구를 가져옵니다 — 여기서 멈춥니다 ──────────────────────────────
# 이 도구를 아직 안 가져왔다면 여기서 멈춥니다. **오류가 나는 것이 정상입니다.**
try:
    import pandas as pd
except ModuleNotFoundError as e:
    print("오류 —", e)
    print("      터미널에 아래 한 줄을 치고 이 파일을 다시 실행합니다.")
    print("      uv add pandas")
    raise SystemExit(0)

# ── 3. dict 가 표가 됩니다 ────────────────────────────────────────────
import pandas as pd

df = pd.DataFrame(data)
print(df)

# ── 4. 표의 기본 상태를 확인합니다 ──────────────────────────────────────────
print("행과 열:", df.shape)
print("열 이름:", list(df.columns))
print("가장 큰 값:", df["visitors"].max())

# ── 5. 열 이름으로 그래프까지 잇습니다 ────────────────────────────────────────
import matplotlib.pyplot as plt

ax = df.plot(x="day", y="visitors", kind="bar", legend=False,
             color="#72757d", figsize=(8, 4.5))
ax.set_ylim(0, 36)
ax.set_title("Visitors by Day")
ax.set_xlabel("Day")
ax.set_ylabel("Visitors (people)")
labels = ax.bar_label(ax.containers[0])
plt.show()

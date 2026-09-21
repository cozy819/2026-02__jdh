"""4-2 대체 실행 파일 — Notebook을 열지 못할 때 사용합니다.

VS Code에서 이 파일을 열고 오른쪽 위 ▶ Run Python File 을 누릅니다.
터미널에서 돌려도 됩니다:  uv run python code/04-2_table.py

Notebook과 다른 점은 이것뿐입니다.
  · 표가 예쁜 칸 대신 **글자 표**로 나옵니다. 값과 열 이름은 똑같습니다.
  · 그래프는 **별도 창**으로 뜹니다. 커널을 다시 시작할 필요가 없습니다.

"""
# [검사] 수업 중에 설치하는 라이브러리를 쓴다 — 이 파일은 문법만 본다.
# 이 파일은 04-2_pandas_table.ipynb 에서 만들어 냅니다. 직접 고치지 않습니다.

# ── 1. 읽을 파일과 머리글을 확인합니다 ────────────────────────────
# 파일: data/04-library-data.csv
# 머리글: date, visitors, borrowed_books

# ── 2. 표를 다루는 도구를 가져옵니다 ──────────────────────────────
# 먼저 VS Code 터미널에서 uv add pandas 를 실행합니다.
try:
    import pandas as pd
except ModuleNotFoundError as e:
    print("오류 —", e)
    print("      VS Code 터미널에서 uv add pandas 를 실행합니다.")
    print("      pyproject.toml에 pandas 줄이 생겼는지 확인한 뒤 다시 실행합니다.")
    raise SystemExit(0)

# ── 3. CSV를 DataFrame으로 읽습니다 ───────────────────────────────
df = pd.read_csv("data/04-library-data.csv")
print(df.head())

# ── 4. 표의 기본 상태와 평균을 확인합니다 ───────────────────────────
print("행과 열:", df.shape)
print("열 이름:", list(df.columns))
print("첫 날짜:", df.loc[0, "date"])
print("방문자 평균:", round(df["visitors"].mean(), 2))
print("대출 권수 평균:", round(df["borrowed_books"].mean(), 2))

# ── 5. 열 이름으로 그래프를 그립니다 ───────────────────────────────
import matplotlib.pyplot as plt

ax = df.plot(x="date", y="visitors", kind="line", legend=False,
             color="#FF5C00", figsize=(10, 4.5))
ax.set_title("Library Visitors")
ax.set_xlabel("Date")
ax.set_ylabel("Visitors")
positions = list(range(0, len(df), 5))
ax.set_xticks(positions)
ax.set_xticklabels(df["date"].iloc[positions], rotation=45, ha="right")
plt.show()

# ── 6. 원자료 위에 5일 평균 추세선을 겹칩니다 ─────────────────────
df["visitor_trend"] = df["visitors"].rolling(window=5, min_periods=1).mean()

ax = df.plot(x="date", y="visitors", color="#8B9098",
             figsize=(10, 4.5), label="Daily visitors")
df.plot(x="date", y="visitor_trend", color="#FF5C00",
        linewidth=3, ax=ax, label="5-day average")
ax.set_title("Library Visitors and Trend")
ax.set_xlabel("Date")
ax.set_ylabel("Visitors")
positions = list(range(0, len(df), 5))
ax.set_xticks(positions)
ax.set_xticklabels(df["date"].iloc[positions], rotation=45, ha="right")
plt.show()

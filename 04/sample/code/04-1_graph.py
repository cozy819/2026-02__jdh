"""4-1 대체 실행 파일 — Notebook을 열지 못할 때 사용합니다.

VS Code에서 이 파일을 열고 오른쪽 위 ▶ Run Python File 을 누릅니다.
터미널에서 돌려도 됩니다:  uv run python code/04-1_graph.py

Notebook과 다른 점은 이것뿐입니다.
  · 그래프가 코드 아래가 아니라 **별도 창**으로 뜹니다. 창을 닫으면 다음 그래프가 나옵니다.
  · 커널을 다시 시작할 필요가 없습니다. 파일을 다시 실행하면 됩니다.

코드는 고치지 않습니다. 출력만 읽습니다.
"""
# [검사] 수업 중에 설치하는 라이브러리를 쓴다 — 이 파일은 문법만 본다.
# 이 파일은 04-1_matplotlib_graph.ipynb 에서 만들어 냅니다. 직접 고치지 않습니다.

# ── 1. 오늘 그릴 자료 ─────────────────────────────────────────────────
days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
visitors = [18, 25, 21, 32, 29]

print(days)
print(visitors)

# ── 2. 그래프를 그려 봅니다 — 여기서 멈춥니다 ───────────────────────────────────
# 이 도구를 아직 안 가져왔다면 여기서 멈춥니다. **오류가 나는 것이 정상입니다.**
try:
    import matplotlib.pyplot as plt
except ModuleNotFoundError as e:
    print("오류 —", e)
    print("      1번: 이런 오류가 떴어. 무엇이 문제인지 설명해 줘.")
    print("      2번: 이 문제를 해결하는 데 필요한 조치를 취해 줘.")
    print("      AI가 끝나면 pyproject.toml에 matplotlib이 추가됐는지 확인하고 다시 실행합니다.")
    raise SystemExit(0)

# ── 3. 다시 그려 봅니다. 코드는 한 글자도 안 고쳤습니다 ─────────────────────────────
import matplotlib.pyplot as plt

plt.figure(figsize=(8, 4.5))
bars = plt.bar(days, visitors, color="#72757d")
plt.ylim(0, 36)
plt.title("Visitors by Day")
plt.xlabel("Day")
plt.ylabel("Visitors")
plt.bar_label(bars)
plt.tight_layout()
plt.show()

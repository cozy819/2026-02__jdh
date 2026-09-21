"""4-1 도입 막대그래프를 만든다. 교사용 도구다 — 학생은 실행하지 않는다.

    uv run python teacher_tools/make_04_charts.py

만드는 것
  output/04-1_visitors_bar.png    4-1 「같은 자료, 두 가지로」의 막대그래프

그래프 안의 글자는 전부 영문으로 쓴다. 학교 PC 에 한글 글꼴이 없으면 네모로 나온다.
"""

from pathlib import Path

import matplotlib.pyplot as plt


OUTPUT = Path(__file__).resolve().parent.parent / "output"
OUTPUT.mkdir(exist_ok=True)

days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
visitors = [18, 25, 21, 32, 29]

fig, ax = plt.subplots(figsize=(8, 4.5))
bars = ax.bar(
    days,
    visitors,
    color=["#72757d", "#72757d", "#72757d", "#ff5a00", "#72757d"],
)
ax.set_ylim(0, 36)
ax.set_title("Visitors by Day")
ax.set_xlabel("Day")
ax.set_ylabel("Visitors (people)")
ax.bar_label(bars)
fig.tight_layout()
fig.savefig(OUTPUT / "04-1_visitors_bar.png", dpi=160)
plt.close(fig)

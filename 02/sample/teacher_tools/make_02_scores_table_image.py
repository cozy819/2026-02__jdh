"""2-2 수업 화면용 가상 성적표 이미지를 만드는 교사용 스크립트.

학생에게 보여 주는 예시 코드가 아니다. `output/02_subject_scores_table.png`를
다시 만들어야 할 때만 실행한다.

    uv run python teacher_tools/make_02_scores_table_image.py
"""

from pathlib import Path

import matplotlib
import pandas as pd
from matplotlib import font_manager
from matplotlib.patches import FancyBboxPatch

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

# ── 폰트 ─────────────────────────────────────────────────────────────
KOREAN_FONT_CANDIDATES = [
    "Apple SD Gothic Neo",   # macOS
    "AppleGothic",           # macOS
    "Malgun Gothic",         # Windows
    "NanumGothic",           # 공통(설치형)
    "Noto Sans CJK KR",      # 공통(설치형)
]


def apply_korean_font() -> bool:
    installed = {f.name for f in font_manager.fontManager.ttflist}
    for name in KOREAN_FONT_CANDIDATES:
        if name in installed:
            plt.rcParams["font.family"] = name
            plt.rcParams["axes.unicode_minus"] = False
            return True
    plt.rcParams["axes.unicode_minus"] = False
    return False


KOREAN_OK = apply_korean_font()

TEXT = {
    True: {
        "title": "가상 과목 성적표",
        "subtitle": "2-2 수업 설명용 예시 · 실제 학생 정보가 아닙니다",
        "columns": ["학생", "국어", "영어", "수학"],
        "students": ["학생 A", "학생 B", "학생 C", "학생 D", "학생 E"],
        "note": "가상 자료",
        "callout": "학생 A의 세 점수를 오늘 코드에 직접 적어 사용합니다.",
    },
    False: {
        "title": "Sample Subject Scores",
        "subtitle": "Example for lesson 2-2 - not real student data",
        "columns": ["Student", "Korean", "English", "Math"],
        "students": ["Student A", "Student B", "Student C", "Student D", "Student E"],
        "note": "Sample data",
        "callout": "Student A's three scores are typed directly into today's code.",
    },
}[KOREAN_OK]

# ── 색 ───────────────────────────────────────────────────────────────
BG = "#F7F8FA"
CARD = "#FFFFFF"
INK = "#1E2A38"
MUTED = "#6B7684"
HEADER_BG = "#2F5D8A"
HIGHLIGHT_BG = "#FDEDE3"
HIGHLIGHT_EDGE = "#E4794A"
ROW_LINE = "#E3E7EC"


def project_root() -> Path:
    here = Path(__file__).resolve()
    for candidate in [here.parent, *here.parents]:
        if (candidate / "pyproject.toml").exists() and (candidate / "data").is_dir():
            return candidate
    return here.parent.parent


ROOT = project_root()
scores = pd.read_csv(ROOT / "data" / "02_subject_scores.csv")

fig = plt.figure(figsize=(16, 9), dpi=150, facecolor=BG)
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 16)
ax.set_ylim(0, 9)
ax.axis("off")
ax.set_facecolor(BG)

# 제목
ax.text(1.1, 8.05, TEXT["title"], fontsize=40, fontweight="bold", color=INK, va="center")
ax.text(1.1, 7.35, TEXT["subtitle"], fontsize=20, color=MUTED, va="center")
ax.text(14.9, 8.05, TEXT["note"], fontsize=18, color=HIGHLIGHT_EDGE,
        va="center", ha="right", fontweight="bold")

# 표 카드
card = FancyBboxPatch((1.0, 1.45), 14.0, 5.35, boxstyle="round,pad=0.16,rounding_size=0.18",
                      linewidth=0, facecolor=CARD, zorder=1)
ax.add_patch(card)

col_x = [2.6, 6.6, 9.6, 12.6]      # 학생 / 국어 / 영어 / 수학
header_y = 6.15
row_h = 0.86
first_row_y = header_y - 0.92

# 머리글 띠
header_band = FancyBboxPatch((1.15, header_y - 0.42), 13.7, 0.84,
                             boxstyle="round,pad=0.0,rounding_size=0.12",
                             linewidth=0, facecolor=HEADER_BG, zorder=2)
ax.add_patch(header_band)
for x, label in zip(col_x, TEXT["columns"]):
    ha = "left" if x == col_x[0] else "center"
    ax.text(x, header_y, label, fontsize=26, fontweight="bold", color="#FFFFFF",
            va="center", ha=ha, zorder=3)

# 각 행
for i, row in scores.iterrows():
    y = first_row_y - i * row_h
    highlight = i == 0
    if highlight:
        band = FancyBboxPatch((1.15, y - 0.38), 13.7, 0.76,
                              boxstyle="round,pad=0.0,rounding_size=0.12",
                              linewidth=2.5, facecolor=HIGHLIGHT_BG,
                              edgecolor=HIGHLIGHT_EDGE, zorder=2)
        ax.add_patch(band)
    elif i < len(scores) - 1:
        ax.plot([1.35, 14.65], [y - 0.42, y - 0.42], color=ROW_LINE, linewidth=1.2, zorder=2)

    weight = "bold" if highlight else "normal"
    size = 30 if highlight else 26
    color = INK if highlight else "#3A4757"
    ax.text(col_x[0], y, TEXT["students"][i], fontsize=size, fontweight=weight,
            color=color, va="center", ha="left", zorder=3)
    for x, key in zip(col_x[1:], ["korean", "english", "math"]):
        ax.text(x, y, str(row[key]), fontsize=size, fontweight=weight,
                color=color, va="center", ha="center", zorder=3)

# 아래 안내
ax.text(1.1, 0.85, TEXT["callout"], fontsize=21, color=HIGHLIGHT_EDGE,
        va="center", fontweight="bold")

out_path = ROOT / "output" / "02_subject_scores_table.png"
fig.savefig(out_path, facecolor=BG)
plt.close(fig)
print(f"saved: {out_path.relative_to(ROOT)}")
print(f"korean_font: {KOREAN_OK}")

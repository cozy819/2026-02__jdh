"""4-1 축 비교 이미지를 만든다. 교사용 도구다 — 학생은 실행하지 않는다.

    uv run python teacher_tools/make_04_axis_comparison.py

만드는 것
  output/04-1_axis_a.png            세로축 0부터 · 제목은 "A" 뿐
  output/04-1_axis_b.png            같은 값, 세로축 15부터 · 제목은 "B" 뿐
  output/04-1_axis_a_reveal.png     A 에 "세로축이 0부터 시작" 을 밝힌 것
  output/04-1_axis_b_reveal.png     B 에 "세로축이 15부터 시작" 을 밝힌 것
  output/04-1_partial_months.png    12개월 중 3개월만 자른 선그래프
  output/04-1_full_months.png       같은 자료의 12개월 전체

두 짝은 **크기·색·글자 크기를 똑같이** 맞춘다. 한쪽이 더 예뻐 보이면 비교가 오염된다.
강조는 오렌지 한 색만 쓴다.

**판정용(A·B)과 공개용(_reveal)을 나눈다.** 제목에 "세로축 0부터" 라고 적어 두면
학생이 판정하기 전에 답을 본다. 활동이 끝난 뒤에 공개용을 띄운다.

**그래프 안의 글자는 전부 영문으로 쓴다.** 학생 PC 는 Windows 이고 matplotlib 의
기본 글꼴에는 한글이 없어 네모로 나온다. 한글 설명은 그래프 밖(교과서·PPT)에 둔다.
"""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
from matplotlib.ticker import MaxNLocator
import matplotlib.pyplot as plt

# 공개용 그림에만 한글이 들어간다. 한글 글꼴을 먼저 고른다.
from matplotlib import font_manager
KOREAN_FONTS = ["Noto Sans CJK KR", "Noto Sans KR", "NanumGothic", "Noto Sans CJK JP",
                "Apple SD Gothic Neo", "AppleGothic", "Malgun Gothic"]
_have = {f.name for f in font_manager.fontManager.ttflist}
_picked = next((f for f in KOREAN_FONTS if f in _have), None)
if _picked is None:
    raise SystemExit(
        "한글 글꼴이 없다. 공개용 그림의 한글이 네모로 나온다.\n"
        "  · 한글 글꼴이 있는 기계에서 돌리거나\n"
        "  · KOREAN_FONTS 에 이 기계의 한글 글꼴 이름을 넣는다.\n"
        f"  찾은 이름: {sorted(KOREAN_FONTS)}")
matplotlib.rcParams["font.family"] = _picked
matplotlib.rcParams["axes.unicode_minus"] = False

OUT = Path(__file__).resolve().parent.parent / "output"
OUT.mkdir(exist_ok=True)

GREY, ORANGE, INK = "#72757d", "#FF5C00", "#1b1d21"
SIZE, DPI = (6.4, 4.2), 200

plt.rcParams.update({
    "font.size": 12, "axes.titlesize": 14, "axes.labelsize": 12,
    "axes.edgecolor": INK, "axes.linewidth": 1.1,
    "axes.spines.top": False, "axes.spines.right": False,
    "figure.facecolor": "white", "axes.facecolor": "white",
})

DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]
VISITORS = [28, 30, 29, 33, 31]          # 차이가 작아야 축 장난이 극적으로 보인다


def bar_chart(path, ymin, title, note=None):
    fig, ax = plt.subplots(figsize=SIZE)
    ax.bar(DAYS, VISITORS, color=GREY, width=0.62)
    ax.set_ylim(ymin, 35)
    ax.yaxis.set_major_locator(MaxNLocator(integer=True, nbins=6))
    # 축이 어디서 시작하는지가 이 그림의 요점이다. 시작값 눈금이 반드시 보여야 한다.
    # 눈금이 16부터 찍히면 학생은 「16부터」라고 적는데 교과서는 「15부터」라고 말한다.
    ticks = [t for t in ax.get_yticks() if ymin <= t <= 35]
    if ymin not in ticks:
        ax.set_yticks([ymin] + ticks)
    ax.set_title(title, color=INK, pad=12, fontweight="bold")
    ax.set_xlabel("Day"); ax.set_ylabel("Visitors (people)")
    ax.tick_params(colors=INK)
    if note:                       # 공개용에만 한글 설명을 붙인다
        ax.text(0.5, -0.26, note, transform=ax.transAxes, ha="center",
                fontsize=13, fontweight="bold", color=ORANGE)
        fig.savefig(path, dpi=DPI, bbox_inches="tight")
    else:
        fig.tight_layout(); fig.savefig(path, dpi=DPI)
    plt.close(fig)
    print("썼다", path.name)


MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
USE = [312, 298, 305, 284, 291, 340, 402, 415, 356, 288, 279, 301]   # 여름에 오르는 모양


def line_chart(path, months, values, title, mark=None):
    fig, ax = plt.subplots(figsize=SIZE)
    ax.plot(months, values, color=GREY, linewidth=2.4, marker="o", markersize=5)
    if mark:
        ax.plot(mark[0], mark[1], color=ORANGE, linewidth=2.8, marker="o", markersize=5)
    ax.set_ylim(250, 440)
    ax.set_title(title, color=INK, pad=12)
    ax.set_xlabel("Month"); ax.set_ylabel("Electricity (kWh)")
    ax.tick_params(colors=INK)
    fig.tight_layout(); fig.savefig(path, dpi=DPI); plt.close(fig)
    print("썼다", path.name)


if __name__ == "__main__":
    bar_chart(OUT / "04-1_axis_a.png", 0, "A")
    bar_chart(OUT / "04-1_axis_b.png", 15, "B")
    bar_chart(OUT / "04-1_axis_a_reveal.png", 0, "A", note="세로축이 0부터 시작")
    bar_chart(OUT / "04-1_axis_b_reveal.png", 15, "B", note="세로축이 15부터 시작")
    # 앞 그림의 제목은 기간을 잘랐다는 것을 알려 주지 않는다.
    # 「Jun - Aug only」 라고 적으면 학생이 보자마자 알아채고 활동이 끝난다.
    line_chart(OUT / "04-1_partial_months.png", MONTHS[5:8], USE[5:8],
               "Electricity Use")
    line_chart(OUT / "04-1_full_months.png", MONTHS, USE,
               "Electricity Use - All 12 Months", mark=(MONTHS[5:8], USE[5:8]))

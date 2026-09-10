"""4-2 워크시트에 쓸 동아리 표를 만든다. 교사용 도구다.

    uv run python teacher_tools/make_04_clubs.py

만드는 것
  data/04-2_clubs.csv   워크시트 ①에 쓸 표

**표 이미지는 만들지 않는다.** 표는 교과서와 PPT 가 직접 그린다.
그림으로 만들면 글꼴에 따라 한글이 깨지고, 투사했을 때도 직접 그린 표가 더 선명하다.

**실제 학교 동아리 인원이 아닌 가상 자료다.** 실제 값을 쓰면 "왜 우리 동아리는 이렇게 적나"로
흘러가 활동의 초점이 흐려진다.

CSV 는 **UTF-8 BOM** 으로 쓴다. 학생이 Windows 탐색기에서 더블클릭하면 Excel 이 여는데,
BOM 이 없으면 Excel 이 CP949 로 오해해 한글이 깨진다. pandas 로 읽을 때는 어느 쪽이든 된다.
"""
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"
DATA.mkdir(exist_ok=True)

ROWS = [("밴드", 12), ("미술", 8), ("코딩", 15), ("독서", 6)]


def main():
    path = DATA / "04-2_clubs.csv"
    text = "club,members\n" + "\n".join(f"{c},{n}" for c, n in ROWS) + "\n"
    path.write_text(text, encoding="utf-8-sig")
    print("썼다", path.name)


if __name__ == "__main__":
    main()

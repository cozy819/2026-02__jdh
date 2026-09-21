"""4-1·4-2 대체 실행 파일(.py)을 노트북에서 만들어 낸다. 교사용 도구다 — 학생은 실행하지 않는다.

    uv run python teacher_tools/make_04_py_fallback.py

만드는 것
  code/04-1_graph.py    04-1_matplotlib_graph.ipynb 의 코드 셀을 순서대로
  code/04-2_table.py    04-2_pandas_table.ipynb 의 코드 셀을 순서대로

왜 있나
  학교 PC 에서 Jupyter 확장이 안 깔리거나 커널이 끝내 안 잡히는 학생이 나온다.
  그 학생도 같은 장면(없어서 멈춘다 → 가져온다 → 된다)을 겪게 하려는 파일이다.

**손으로 고치지 않는다.** 노트북을 고치고 이 스크립트를 다시 돌린다.
셋(교과서·노트북·.py)이 어긋나는 것을 막으려고 코드 본문을 노트북에서 그대로 가져온다.
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
NB = HERE.parent / "notebooks"
OUT = HERE.parent / "code"
OUT.mkdir(exist_ok=True)

RULE = 66          # 구분선 길이를 고정한다. 제목 길이에 따라 들쭉날쭉하지 않게.


def bar(n, label):
    head = f"# ── {n}. {label} "
    return head + "─" * max(3, RULE - len(head))


HEAD = '''"""{title} 대체 실행 파일 — Notebook을 열지 못할 때 사용합니다.

VS Code에서 이 파일을 열고 오른쪽 위 ▶ Run Python File 을 누릅니다.
터미널에서 돌려도 됩니다:  uv run python code/{name}

Notebook과 다른 점은 이것뿐입니다.
{diff}

코드는 고치지 않습니다. 출력만 읽습니다.
"""
# [검사] 수업 중에 설치하는 라이브러리를 쓴다 — 이 파일은 문법만 본다.
# 이 파일은 {src} 에서 만들어 냅니다. 직접 고치지 않습니다.
'''

GUARD = '''# 이 도구를 아직 안 가져왔다면 여기서 멈춥니다. **오류가 나는 것이 정상입니다.**
try:
{body}
except ModuleNotFoundError as e:
    print("오류 —", e)
    print("      터미널에 아래 한 줄을 치고 이 파일을 다시 실행합니다.")
    print("      uv add {lib}")
    raise SystemExit(0)
'''

GUARD_AI = '''# 이 도구를 아직 안 가져왔다면 여기서 멈춥니다. **오류가 나는 것이 정상입니다.**
try:
{body}
except ModuleNotFoundError as e:
    print("오류 —", e)
    print("      1번: 이런 오류가 떴어. 무엇이 문제인지 설명해 줘.")
    print("      2번: 이 문제를 해결하는 데 필요한 조치를 취해 줘.")
    print("      AI가 끝나면 pyproject.toml에 {lib}이 추가됐는지 확인하고 다시 실행합니다.")
    raise SystemExit(0)
'''


def cells(path):
    nb = json.loads(Path(path).read_text(encoding="utf-8"))
    return ["".join(c["source"]).strip() for c in nb["cells"] if c["cell_type"] == "code"]


def build(src, out, title, diff, plan):
    cs = cells(NB / src)
    parts = [HEAD.format(title=title, name=out, src=src, diff=diff)]
    for n, step in enumerate(plan, 1):
        idx, label, kind = step[0], step[1], step[2]
        edit = step[3] if len(step) > 3 else None
        body = cs[idx]
        parts.append("\n" + bar(n, label) + "\n")
        if kind == "guard":
            parts.append(GUARD.format(lib=edit,
                                      body="\n".join("    " + l for l in body.split("\n"))))
            continue
        if kind == "guard_ai":
            parts.append(GUARD_AI.format(lib=edit,
                                         body="\n".join("    " + l for l in body.split("\n"))))
            continue
        if edit:
            lines = body.split("\n")
            for how, text in edit:
                if how == "replace_last":
                    # Notebook 은 마지막 줄에 이름만 적으면 표를 그려 준다. 스크립트는 안 그런다.
                    lines[-1] = text
                elif how == "prepend":
                    lines = text.split("\n") + [""] + lines
                elif how == "append":
                    lines = lines + [text]
                elif how == "replace":
                    old, new = text
                    lines = [line.replace(old, new) for line in lines]
            body = "\n".join(lines)
        parts.append(body + "\n")
    (OUT / out).write_text("".join(parts).rstrip() + "\n", encoding="utf-8")
    print("썼다", out)


build(
    "04-1_matplotlib_graph.ipynb", "04-1_graph.py", "4-1",
    "  · 그래프가 코드 아래가 아니라 **별도 창**으로 뜹니다. 창을 닫으면 다음 그래프가 나옵니다.\n"
    "  · 커널을 다시 시작할 필요가 없습니다. 파일을 다시 실행하면 됩니다.",
    [(0, "오늘 그릴 자료", "plain"),
     (1, "그래프를 그려 봅니다 — 여기서 멈춥니다", "guard_ai", "matplotlib"),
     # import 가 한 번 더 나오는 것은 Notebook·교과서와 같게 두려는 것이다.
     (2, "다시 그려 봅니다. 코드는 한 글자도 안 고쳤습니다", "plain")])

build(
    "04-2_pandas_table.ipynb", "04-2_table.py", "4-2",
    "  · 표가 예쁜 칸 대신 **글자 표**로 나옵니다. 값과 열 이름은 똑같습니다.\n"
    "  · 그래프는 **별도 창**으로 뜹니다. 커널을 다시 시작할 필요가 없습니다.",
    [(0, "표를 다루는 도구를 가져옵니다 — 여기서 멈춥니다", "guard_ai", "pandas"),
     (1, "CSV가 표가 됩니다", "plain", [
         ("replace", ("../data/04-library-data.csv", "data/04-library-data.csv")),
         ("replace_last", "print(df.head())"),
     ]),
     (2, "표의 기본 상태를 확인합니다", "plain"),
     (3, "열 이름으로 그래프까지 잇습니다", "plain",
      [("prepend", "import matplotlib.pyplot as plt"),
       ("append", "plt.show()")]),
     (4, "원자료 위에 5일 평균 추세선을 겹칩니다", "plain",
      [("prepend", "import matplotlib.pyplot as plt"),
       ("append", "plt.show()")])])

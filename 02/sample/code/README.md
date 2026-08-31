# code

2-2 「숫자와 변수로 계산하기」 수업에서 화면에 보여 줄 **짧은 완성 예시 코드**다.
학생이 처음부터 작성하는 과제가 아니라, **읽고 · 숫자를 찾고 · 결과를 예상하고 · 실행해 비교하는** 자료다.

## 학생에게 보여 주는 파일

| 파일 | 내용 | 실행 결과 |
|---|---|---|
| `01_first_result.py` | 첫 Python 실행과 `print()` 확인 | `8` |
| `02_four_calculations.py` | 더하기·빼기·곱하기·나누기 확인 | `10` / `6` / `16` / `4.0` |
| `03_number_text_cases.py` | 숫자 덧셈 → 문자열 이어 붙이기 → 글자와 숫자의 오류를 순서대로 확인 | `5` / `23` / `TypeError` |
| `04_variables.py` | 학생 A의 이름과 세 점수 합계 확인 | `학생 A` / `249` |
| `05_numbers_and_variables.py` | 학생 A의 세 점수로 합계·평균을 예상하고 확인 | `249` / `83.0` |
| `student_scores.py` | OpenCode에 요청해 수업 중 새로 만드는 AI 실습 파일 · 배포 자료에는 미포함 | `학생 A` / `249` / `83.0` |

### 사용 범위

숫자, `print()`, 변수, 덧셈(`+`), 나눗셈(`/`)까지만 사용한다.

**사용하지 않는 것**: CSV 읽기, pandas, list, dict, 조건문, 반복문, 함수, `input()`,
클래스, 예외 처리, 소수점 출력 형식을 맞추는 문법.

성적표의 숫자는 CSV에서 읽어 오지 않고 **코드에 직접 적혀 있다.**
원본 표는 `data/02_subject_scores.csv`와 `output/02_subject_scores_table.png`에서 확인한다.

### 실행

```bash
uv run python code/01_first_result.py
uv run python code/02_four_calculations.py
uv run python code/03_number_text_cases.py
uv run python code/04_variables.py
uv run python code/05_numbers_and_variables.py
```

VS Code에서는 파일을 열고 오른쪽 위의 `▶ Run Python File` 버튼을 누른다. 학생은 준비된 파일을 읽고 실행하며, 숫자나 계산식을 임의로 바꾸지 않는다.

AI 실습에서는 OpenCode에 파일명을 포함해 요청하고, 생성된 `student_scores.py`를 `code` 폴더에서 연 뒤 같은 방법으로 실행한다.

CSV와 수업용 이미지를 다시 만드는 스크립트는 학생용 코드와 섞이지 않도록 `teacher_tools/`로 분리했다.

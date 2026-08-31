# code

2-2 「숫자와 변수로 계산하기」 수업에서 화면에 보여 줄 **짧은 완성 예시 코드**다.
학생이 처음부터 작성하는 과제가 아니라, **읽고 · 숫자를 찾고 · 결과를 예상하고 · 실행해 비교하는** 자료다.

## 학생에게 보여 주는 파일

| 파일 | 내용 | 실행 결과 |
|---|---|---|
| `02_first_result.py` | 첫 Python 실행과 `print()` 확인 | `8` |
| `03_four_calculations.py` | 더하기·빼기·곱하기·나누기 확인 | `10` / `6` / `16` / `4.0` |
| `04_number_and_text.py` | 숫자 덧셈과 문자열 이어 붙이기 비교 | `5` / `23` |
| `05_variables.py` | 학생 A의 이름과 세 점수 합계 확인 | `학생 A` / `249` |
| `02_numbers_and_variables.py` | 학생 A의 세 점수로 합계·평균을 예상하고 확인 | `249` / `83.0` |
| `02_numbers_and_variables_changed.py` | 교사가 실행 결과 차이를 보여 줄 때만 쓰는 예비 비교본 | `259` / `86.33333333333333` |

두 파일은 **줄 수와 배치가 완전히 같고, 4번째 줄 하나만 다르다.**
PPT에서는 다음 순서로 캡처해 사용한다.

1. 바꾸기 전 코드
2. 바뀐 한 줄
3. 바꾸기 전 실행 결과
4. 바뀐 뒤 실행 결과

이 비교로 `수학 점수 변경 → 합계 변경 → 평균 변경`의 흐름이 드러난다.

### 사용 범위

숫자, `print()`, 변수, 덧셈(`+`), 나눗셈(`/`)까지만 사용한다.

**사용하지 않는 것**: CSV 읽기, pandas, list, dict, 조건문, 반복문, 함수, `input()`,
클래스, 예외 처리, 소수점 출력 형식을 맞추는 문법.

성적표의 숫자는 CSV에서 읽어 오지 않고 **코드에 직접 적혀 있다.**
원본 표는 `data/02_subject_scores.csv`와 `output/02_subject_scores_table.png`에서 확인한다.

### 실행

```bash
uv run python code/02_first_result.py
uv run python code/03_four_calculations.py
uv run python code/04_number_and_text.py
uv run python code/05_variables.py
uv run python code/02_numbers_and_variables.py
```

VS Code에서는 파일을 열고 오른쪽 위의 `▶ Run Python File` 버튼을 누른다. 학생은 준비된 파일을 읽고 실행하며, 숫자나 계산식을 임의로 바꾸지 않는다. `02_numbers_and_variables_changed.py`는 학생 수정 활동이 아니라 교사가 필요할 때만 보여 주는 예비 비교본이다.

## 교사용 파일

| 파일 | 내용 |
|---|---|
| `make_01_festival_data.py` | 2-1용 가상 축제 방문 기록 100,000행을 같은 조건으로 다시 만드는 스크립트 |
| `make_02_scores_table_image.py` | `output/02_subject_scores_table.png`를 다시 만드는 스크립트 |

**수업에서 학생에게 보여 주지 않는다.** 성적표 이미지를 고쳐야 할 때만 실행한다.

```bash
uv run python code/make_01_festival_data.py
uv run python code/make_02_scores_table_image.py
```

# 2주차 수업 샘플 자료 (교사용)

장대현중고등학교 「정보와 디지털 문해력」 **2-1·2-2 수업에서 화면으로 보여 줄 자료**를 모아 둔 폴더다.
학생이 처음부터 만들어 가는 starter 프로젝트가 아니라, **교사가 이미 완성된 결과를 보여 주는 sample**이다.

> 이 폴더의 모든 숫자와 이름은 수업용으로 만든 **가상 자료**다.
> 실제 학교·학생의 정보가 아니며, **수행평가의 실제 데이터나 정답도 아니다.**

## 2-1 자료 — 흥미 유도용 복합 데이터와 대시보드

코딩으로 데이터를 다루면 **시각적으로 어디까지 결과를 만들 수 있는지** 먼저 보여 주기 위한 자료다.

| 파일 | 역할 |
|---|---|
| `data/01_festival_booth_activity.csv` | 가상 학교 축제 부스 방문 기록 (100,000행 × 9열) |
| `notebooks/00_visualization_preview.ipynb` | CSV 읽기 → 대시보드 제작 → 원본과 대조까지 실행 결과가 저장된 완성본 |
| `output/01_festival_dashboard.png` | PPT용 16:9 대시보드 이미지 |

주의할 점:

- 이 대시보드는 **흥미 유도용 샘플**이다. 수행평가 1의 정답이나 난이도 예시가 아니다.
- **학생에게 이 대시보드 전체를 만들라고 요구하지 않는다.**
- 수행평가 1에서는 **별도의 더 단순한 CSV로 지정된 그래프 한 개**를 완성한다.
- 학생에게 보여 줄 핵심은 `100,000행의 원본 → 실제 실행 코드 → 저장된 결과 이미지`로 이어지는 흐름이다.

## 2-2 자료 — 숫자·변수 설명용 성적표

2-1의 복합 데이터를 그대로 쓰지 않는다. **한눈에 읽히는 작은 표**를 따로 쓴다.

| 파일 | 역할 |
|---|---|
| `data/02_subject_scores.csv` | 가상 과목 성적표 (학생 5명 × 3과목) |
| `output/02_subject_scores_table.png` | 수업 화면용 성적표 이미지, 학생 A의 행을 강조 |
| `code/02_first_result.py` | `print(3 + 5)`를 실행해 첫 결과 `8`을 확인하는 준비 파일 |
| `code/03_four_calculations.py` | 네 가지 기본 산술연산을 차례로 확인하는 준비 파일 |
| `code/04_number_and_text.py` | `2 + 3`과 `'2' + '3'`의 결과를 비교하는 준비 파일 |
| `code/05_variables.py` | 학생 A의 이름과 세 과목 합계를 변수로 표현하는 준비 파일 |
| `code/02_numbers_and_variables.py` | 학생 A의 점수로 합계·평균을 예상하고 확인하는 예시 코드 |
| `code/02_numbers_and_variables_changed.py` | 교사가 필요할 때만 보여 주는 예비 비교본 |

주의할 점:

- **2-2에서는 CSV를 Python으로 읽지 않는다.** CSV는 화면에 보여 줄 표의 원본일 뿐이다.
- 성적표의 숫자를 **코드에 직접 적어 넣어** 변수·합계·평균을 설명한다.
- **pandas를 사용하지 않는다.** 반복문·조건문·함수·`input()`도 사용하지 않는다.
- 사용하는 범위는 숫자, `print()`, 변수, 덧셈, 나눗셈까지다.

## 환경 준비

이 폴더에서 실행한다. 가상환경은 이 폴더의 `.venv`에 만들어진다.

```bash
uv sync
```

## 실행 방법

```bash
# 2-1 Notebook 열기 (JupyterLab)
uv run jupyter lab

# 2-2 예시 코드 실행
uv run python code/02_first_result.py
uv run python code/03_four_calculations.py
uv run python code/04_number_and_text.py
uv run python code/05_variables.py
uv run python code/02_numbers_and_variables.py
```

VS Code에서 Notebook을 열 때는 이 폴더의 `.venv`를 Python 환경으로 선택한다.

Notebook은 실행 결과가 저장된 상태로 배포되므로, 수업 전에 다시 실행하지 않아도 화면에 결과가 보인다.
**다시 실행하면 `output/01_festival_dashboard.png`가 새로 덮어써진다.**

## 포함 라이브러리

- pandas: 표 데이터 읽기와 처리 (2-1 Notebook에서만 사용)
- matplotlib: 그래프와 이미지 제작
- JupyterLab: Notebook 실행
- ipykernel: Notebook에서 이 가상환경 사용

## 폴더

- `data/`: 2-1 복합 CSV와 2-2 성적표 CSV
- `notebooks/`: 2-1 완성 예시 Notebook
- `code/`: 2-2 학생용 예시 코드와 교사용 이미지 생성 스크립트
- `output/`: PPT에 넣을 이미지

04 학생용 수업 자료

1. 이 ZIP 파일의 압축을 풉니다.
2. 문서 폴더의 JDH_VibeCoding_자기이름 폴더 안에 압축을 풀어 생긴 04 폴더를 넣습니다.
3. VS Code에서 04 폴더를 통째로 엽니다. 파일 하나만 열면 다음 단계가 되지 않습니다.
4. 터미널에 uv sync 를 입력합니다. 이 명령은 pyproject.toml과 uv.lock을 확인해 .venv를 프로젝트 조건에 맞춥니다.
5. Notebook 오른쪽 위에서 경로에 04와 .venv가 함께 보이는 커널을 고릅니다.

커널 목록에 .venv 가 안 보이면
- 왼쪽 탐색기 맨 위 이름이 04 인지 봅니다. 다른 이름이면 폴더를 잘못 연 것입니다.
- 파일 → 폴더 열기 로 04 폴더 자체를 다시 엽니다. 04 안으로 들어가서 고르지 않습니다.

이번 자료는 그림 그리는 도구가 일부러 빠져 있습니다
Excel을 읽는 openpyxl은 들어 있지만, uv sync 를 해도 matplotlib 과 pandas 는 들어오지 않습니다. 빠뜨린 것이 아닙니다.

4-1에서 여는 파일
- pyproject.toml  (이 프로젝트가 쓰는 도구 목록)
- notebooks/04-1_matplotlib_graph.ipynb
- notebooks/04-1_exercise.ipynb  (Excel 자료로 직접 그래프를 만드는 실습)
- data/04-library-data.xlsx  (4-1 실습 원본)
- code/04-1_graph.py  (Notebook이 열리지 않을 때 대신 실행)

먼저 pyproject.toml의 requires-python과 dependencies를 읽습니다. Python은 3.11 이상을 사용하며, 처음에는 ipykernel과 openpyxl이 있고 matplotlib은 없습니다.
import matplotlib.pyplot as plt 셀을 실행하면 오류가 나는 것이 정상입니다.
오류 마지막 줄을 복사해 AI에게 아래처럼 요청합니다.

1번: 오류가 난 코드와 마지막 줄을 함께 보내고, 무엇이 문제인지 묻습니다.
2번: AI의 답을 읽은 뒤, 필요한 조치를 해 달라고 요청합니다.

AI가 작업을 마치면 pyproject.toml을 다시 열어 matplotlib 줄이 생겼는지 확인합니다.
그다음 커널을 다시 시작하고 같은 셀과 그리기 셀을 실행합니다.

실습 데이터는 12주 동안의 평일 60일 기록입니다. 방문자 수는 전체적으로 늘고, 금요일의 방문과 대출이 반복해서 높습니다.

4-2에서 여는 파일
- notebooks/04-2_pandas_table.ipynb
- notebooks/04-2_exercise.ipynb  (CSV 자료를 pandas로 읽고 5일 평균 추세선을 만드는 실습)
- code/04-2_table.py  (Notebook이 열리지 않을 때 대신 실행)
- data/04-library-data.csv  (4-1 Excel과 내용이 같은 자료)

VS Code 터미널에서 uv add pandas 를 직접 실행하고, pyproject.toml에 pandas 줄이 생겼는지 확인합니다.
그다음 AI에게 자료 이해, 평균 계산, 축 선택, 그래프 제작, 결과 검토를 차례로 요청합니다. 한 번에 전부 맡기지 않습니다.
마지막에는 04-2_pandas_table.ipynb의 1번부터 6번까지를 차례로 엽니다.
각 번호의 실제 코드 전체를 보고, 파일 읽기·표 확인·축 설정·추세선 만들기처럼
화면에서 한 일이 어떤 코드 블록에 적혀 있는지 읽습니다.

Notebook이 안 열릴 때
code 폴더의 파일을 대신 실행합니다. 배우는 내용은 똑같습니다.
다만 그래프가 코드 아래가 아니라 별도 창으로 뜨고, 창을 닫으면 다음 그래프가 나옵니다.
이때는 커널을 다시 시작할 필요가 없습니다. AI가 라이브러리를 추가한 뒤 파일을 다시 실행하면 됩니다.

완성한 두 exercise Notebook은 04 폴더에 그대로 저장합니다.

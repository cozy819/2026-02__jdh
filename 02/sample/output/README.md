# output

PPT와 수업 화면에 넣을 결과물을 모아 둔다. 두 이미지 모두 **16:9, 2400×1350(150dpi)**로 만들어
화면에 크게 띄우거나 A4 교과서에 넣어도 제목·수치·그래프가 구분된다.

## `01_festival_dashboard.png` — 2-1

`notebooks/00_visualization_preview.ipynb`를 실행하면 만들어지는 대시보드 이미지다.
가상 방문 기록 **100,000행**을 실제로 읽고 집계한 결과이며, 교과서 2쪽에는 실행 코드와 함께 넣는다.

담긴 내용:

- 숫자 요약 3개 — 전체 방문자 수, 방문자가 가장 많은 부스, 평균 만족도
- 부스별 방문자 수 막대그래프
- 시간대별 방문자 변화 선그래프
- 평균 대기 시간과 만족도의 관계 산점도

**Notebook을 다시 실행하면 이 파일은 새로 덮어써진다.**
흥미 유도용 샘플이며, 학생에게 이 화면 전체를 만들라고 요구하지 않는다.

교과서에는 같은 파일을 `assets/img/02-1-01-festival-dashboard.png`로 복사해 사용한다.
Notebook을 다시 실행했다면 그 사본도 함께 갱신한다.

```bash
cp output/01_festival_dashboard.png ../../assets/img/02-1-01-festival-dashboard.png
```

## `02_subject_scores_table.png` — 2-2

`data/02_subject_scores.csv`를 수업 화면용 표로 만든 이미지다.
**학생 A의 행(국어 82 · 영어 91 · 수학 76)을 강조**해, 그 세 숫자가
`code/02_numbers_and_variables.py`의 변수로 이어진다는 것을 보여 준다.
오른쪽 위에 `가상 자료` 표시를 넣어 개인정보가 아님을 화면에서 바로 알 수 있게 했다.

다시 만들어야 할 때만 실행한다.

```bash
uv run python code/make_02_scores_table_image.py
```

## `00_visualization_preview_executed.html` — 2-1

실행이 끝난 Notebook을 그대로 내보낸 HTML이다. Python이 설치되지 않은 컴퓨터에서도
브라우저로 열어 **코드와 실제 출력(100,000행 · 9열 · 비어 있는 값 0)** 을 함께 보여 줄 수 있다.

Notebook을 다시 실행한 뒤에는 이 파일도 함께 갱신한다.

```bash
uv run jupyter nbconvert --to html --output-dir output \
  --output 00_visualization_preview_executed notebooks/00_visualization_preview.ipynb
```

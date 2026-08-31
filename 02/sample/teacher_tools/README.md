# teacher_tools

수업 화면에 사용할 CSV와 이미지를 다시 만드는 **교사용 생성 도구**다. 학생이 읽거나 실행하는 수업 파일이 아니다.

| 파일 | 역할 |
|---|---|
| `make_01_festival_data.py` | 2-1용 가상 축제 방문 기록 100,000행을 같은 조건으로 다시 만든다. |
| `make_02_scores_table_image.py` | `output/02_subject_scores_table.png`를 다시 만든다. |

프로젝트 루트인 `02/sample`에서 필요한 명령만 실행한다.

```bash
uv run python teacher_tools/make_01_festival_data.py
uv run python teacher_tools/make_02_scores_table_image.py
```

생성 결과를 다시 만들 필요가 없다면 이 폴더는 열지 않는다.

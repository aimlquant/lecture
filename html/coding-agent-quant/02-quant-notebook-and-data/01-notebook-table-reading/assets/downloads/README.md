# 과정 2 영상 1 · 실습 시작 안내

저장된 출력과 현재 커널을 구분하고, 가격표의 구조를 확인하는 실습입니다.
과정 1에서 준비한 VS Code·Python·Jupyter 환경을 사용합니다.

## 파일 배치

```text
course-02-practice/
├── data/
│   └── kodex200-price-fixture.csv
├── metadata/
│   └── kodex200-price-fixture.metadata.json
├── notebooks/
│   ├── notebook-table-reading.ipynb
│   └── table-check-cases.ipynb
├── requirements.txt
├── experiment-results.csv
└── README.md
```

VS Code에서 `course-02-practice` 폴더를 엽니다. 과정 1에서 만든 가상 환경을
사용하거나 이 폴더에 `.venv`를 준비하고, 해당 환경의 터미널에서 패키지를 설치합니다.

```bash
python -m pip install -r requirements.txt
```

검증한 버전은 Python 3.13.5, pandas 2.3.3, ipykernel 7.3.0입니다.
노트북 오른쪽 위의 커널 선택에서 이 패키지를 설치한 Python 환경을 고릅니다.
기존 가상 환경을 사용할 경우 먼저 그 환경의 버전과 패키지 구성을 확인합니다.
실습 실행 중에는 가격 다운로드나 API 키가 필요하지 않습니다.

## 먼저 주 실습을 실행합니다

1. `notebook-table-reading.ipynb`를 엽니다. 저장된 표는 이전 출력입니다.
2. 커널을 선택한 뒤 **Restart**로 재시작하고 확인합니다.
3. 두 번째 코드 셀 `display(prices.head(4))`만 실행합니다.
4. `NameError: name 'prices' is not defined`를 확인합니다.
5. 첫 코드 셀에서 CSV를 읽고, 두 번째 셀을 다시 실행합니다.
6. 세 번째 코드 셀에서 표 구조 점검표를 확인합니다.
7. 다시 **Restart → Run All**을 수행하고 결과를 확인한 뒤 저장합니다.

셀 입력이 접혀 있으면 셀의 짧은 코드 미리 보기를 두 번 눌러 펼칠 수 있습니다.
처음부터 정상 실행만 확인하려면 3~6을 건너뛰고 재시작 후 전체 실행을 합니다.

## 기대 결과

| 항목 | 이 파일의 기대 상태 |
|---|---|
| 행 × 열 | 12 × 7 |
| 열 이름 | Date, Open, High, Low, Close, Volume, Change |
| 인덱스 | 0부터 시작하는 기본 RangeIndex |
| Date 자료형 | datetime64[ns] |
| 전체 결측 | 0개 |
| 중복 날짜 | 0개 |
| 날짜 정렬 | 오름차순 |
| 날짜 범위 | 2024-01-02 ~ 2024-01-17 |

새 커널의 코드 셀 세 개가 정상 완료되고 마지막에 **표 구조 점검 통과**가 나와야 합니다.
이 결과는 표 구조와 실행 재현을 확인합니다. 가격의 정확성이나 백테스트 타당성을
보장하는 기준은 아닙니다.

## 변형 실험은 그다음에 합니다

`table-check-cases.ipynb`를 같은 `notebooks/`에 놓고 커널을 선택합니다.
첫 코드 셀로 실험을 준비한 뒤 각 사례의 결과를 예상하고 실행합니다.
각 사례는 정상 원본의 복사본을 사용하며 CSV 원본을 덮어쓰지 않습니다.

- 결측·중복·행 순서·날짜 자료형·깨진 날짜·필수 열·행 수·인덱스를 각각 바꿉니다.
- **확인 필요**는 기대 조건과 다른 항목입니다.
- **확인 불가**는 계산할 선행 조건이 없는 항목입니다.
- 변형 실험은 예상한 문제를 찾으면 성공입니다. 안내된 RuntimeError는 보조 함수가
  잡아서 표 아래에 표시하므로 여러 사례를 전체 실행으로 비교할 수도 있습니다.
- `experiment-results.csv`에서 제작 실험의 관측 결과와 비교합니다.

## 막혔을 때

- **파일을 찾을 수 없음:** CSV가 `data/`, 노트북이 `notebooks/`에 있는지 확인합니다.
- **pandas를 불러올 수 없음:** 노트북이 패키지를 설치한 환경을 선택했는지 확인합니다.
- **NameError:** 메시지의 정확한 이름, 그 이름을 만드는 앞 셀의 성공 여부, 철자를 확인합니다.
- **Date 관련 ValueError:** CSV 열 이름과 제공한 원본 파일이 같은지 확인합니다.
- **점검 실패:** 통과 문구 대신 항목별 결과를 읽고, 정상 원본으로 돌아가 다시 실행합니다.

입력의 유래·발췌 범위·SHA-256은 `metadata/kodex200-price-fixture.metadata.json`에 있습니다.

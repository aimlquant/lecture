# 투자 데이터 출처 선택 · 실습 시작 안내

과정 2 영상 2. 확인일 2026-09-06.

## 가장 쉬운 시작

1. source-practice-starter.zip을 풀고 VS Code에서 course-02-data-practice 폴더를 엽니다.
2. 과정 1에서 준비한 Python 환경을 선택합니다. 아래 패키지 설치를 같은 환경에서 마친 뒤 그 환경을 노트북 커널로 선택합니다.
3. 사용 중인 코딩 에이전트에 만들기-요청.txt 전체를 전달합니다. 현재 작업 폴더에 파일을 만들 수 있는지 확인합니다.
4. 생성된 data-source-selection.ipynb를 주피터 노트북 편집기로 엽니다. JSON 글자만 보이면 탭의 편집기 전환 메뉴에서 Jupyter Notebook을 고릅니다.
5. 커널을 선택하고 위에서 아래로 실행합니다. 이 실습은 마지막 셀에 의도적인 파일명 오류가 있습니다.
6. 조회 성공·표 확인·값 하나·출처 선택표를 차례로 읽습니다. 마지막 FileNotFoundError를 확인한 뒤 복구-요청.txt를 에이전트에 전달합니다.
7. 에이전트의 수정 뒤 커널을 재시작하고 모두 실행합니다. 저장본 사용·해시 일치·12행·7열·기간을 확인한 뒤 저장합니다.

## 파일 배치

```text
course-02-data-practice/
├── data/
│   ├── price-snapshot.csv
│   └── snapshot-metadata.json
├── 만들기-요청.txt
├── 복구-요청.txt
├── requirements.txt
├── README.md
└── data-source-selection.ipynb  ← 코딩 에이전트가 생성
```

노트북이 있는 폴더가 실행 기준입니다. data 폴더와 노트북을 나란히 둡니다. 결과는 outputs 아래 새 실행 폴더에 저장됩니다. 결과 폴더에는 prices.csv, metadata.json, sources.csv, data-source-selection.md가 있습니다. 실패 시 failure.json이 남고 가상 가격이나 저장본으로 자동 바뀌지 않습니다.

## 환경 준비

실제 실행 환경은 Ubuntu, VS Code 1.135.0, Jupyter 확장 2025.9.1, Python 3.12.3, Codex CLI 0.153.3입니다. Claude Code에서는 실제 실행하지 않았습니다. 공통 한국어 요청문과 표준 ipynb를 제공하며, 다른 코딩 에이전트에서도 작업 폴더와 명령 실행 권한을 확인합니다. 호스트 특유의 권한 설정을 따라 할 필요는 없습니다.

코딩 에이전트에 “이 폴더의 requirements.txt를 선택한 Python 가상 환경에 설치하고, VS Code에서 선택할 커널을 알려 주세요. 시스템 Python이나 기존 입력은 바꾸지 마세요.”라고 요청할 수 있습니다. 설치 명령은 선택한 환경에서 `python -m pip install -r requirements.txt`입니다. 패키지 설치와 첫 노트북 실행이 낯설다면 과정 2 영상 1의 환경 안내를 먼저 확인합니다.

## 두 가지 실행 모드

- 조회: FinanceDataReader의 NAVER:069500 경로에서 새로 받습니다. 실제 제공처는 네이버 금융, 거래 시장은 KRX입니다. 이번에는 공식 KRX OPEN API를 직접 호출하지 않습니다.
- 저장본: 제공한 data 파일 둘의 해시와 출처를 확인해 재사용합니다. 인터넷 조회를 하지 않으며 원래 수집시각이 유지됩니다. 시작 묶음에는 검증된 저장본이 있으므로 네트워크 조회가 실패해도 실패를 기록한 뒤 별도로 이 모드를 선택할 수 있습니다.

처음 받은 새 조회 결과를 다음 재실행의 입력으로 삼으려면, 새 실습 폴더를 만들고 성공 실행 폴더의 prices.csv·metadata.json을 각각 data/price-snapshot.csv·data/snapshot-metadata.json으로 복사합니다. 기존 입력 파일이 있으면 덮어쓰지 않습니다. 시작 묶음의 저장본으로 실습하는 경우 새 조회 결과와 다를 수도 있으므로 수집시각을 따로 읽습니다.

## 제공 노트북과 결과의 차이

- data-source-selection.ipynb: 실제 에이전트 생성 코드의 빈 출력 원본. 조회 모드와 의도적 오류가 있습니다. 에이전트의 생성 결과와 비교할 때 사용합니다.
- data-source-selection-checked.ipynb: 에이전트 수정 뒤 저장본 모드로 커널을 재시작해 모두 실행한 결과. 저장된 출력은 이전 실행 기록입니다. 답안 묶음 안에서는 같은 작업 이름인 data-source-selection.ipynb로 들어 있습니다.
- source-practice-answer.zip: 수정된 노트북·입력·요청문·관측 결과를 경로 그대로 묶었습니다.
- sources.csv와 data-source-selection.md: 첫 온라인 조회가 남긴 출처 선택표와 기록입니다. 저장본 재실행의 새 기록은 각 실행의 outputs에서 확인합니다.

## 2026-09-06에 관찰한 결과

2024-01-02~2024-01-17, 12행·7열. Date, Open, High, Low, Close, Volume, Change. 빈 값·중복 날짜 0, 날짜 오름차순. 2024-01-02 Close는 34541입니다. 조회시각은 2026-09-06 10:59:56 KST이며 메타데이터에는 같은 시각을 UTC(+00:00)로 기록했습니다. CSV 해시는 snapshot-metadata.json에 있습니다.

조회 성공은 공식 원본 대조 완료가 아닙니다. 같은 날짜·가격 정의의 KRX 원본은 확보하지 않아 대조 상태는 보류입니다. sources.csv의 verified_on은 공식 값 대조 완료일이므로 이번에는 빈 값입니다. 공식 문서 확인일 2026-09-06과 혼동하지 않습니다. 12행이라는 관찰값만으로 거래일 완전성을 보장하지 않습니다.

가격 파일은 영상 1에서 이미 제공한 12행 입력과 바이트가 같습니다. 이번 메타데이터는 새 조회의 실제 경로와 시각을 남깁니다. 수집 도구의 오픈소스 이용허락은 시장 자료의 공개 재배포 허가가 아닙니다. 데이터를 다른 서비스에 공개할 때는 해당 제공처의 조건을 따로 확인합니다.

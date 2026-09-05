# Codex와 시작하는 주피터 노트북 · 실습 시작 안내

## 처음 준비할 것

과정 1에서 설치한 VS Code, Python, Python 확장, Jupyter 확장과 로그인된 Codex CLI를 사용합니다.
처음 실행하는 환경이라면 과정 1의 설치 실습을 먼저 마치세요. Python 문법을 외울 필요는 없습니다.

1. `notebook-intro-starter.zip`을 내려받아 압축을 풉니다.
2. VS Code의 파일 → 폴더 열기로 `course-02-practice` 폴더를 엽니다.
3. 압축을 풀었을 때의 배치는 아래와 같습니다. notebooks 폴더는 비어 있습니다.

```text
course-02-practice/
├── data/kodex200-price-fixture.csv
├── notebooks/
├── 만들기-요청.txt
├── 복구-요청.txt
├── requirements.txt
└── README.md
```

이번 검증 환경: Linux, VS Code 1.135.0, Codex CLI 0.153.3, Python 3.13.5,
pandas 2.3.3, ipykernel 7.3.0, Python 확장 2026.4.0, Jupyter 확장 2025.9.1.
운영체제에 따라 버튼 위치와 메뉴 번역은 조금 다를 수 있습니다.

## Python 환경이 아직 없을 때

VS Code 명령 팔레트에서 `Python: Create Environment` → `Venv` → 설치된 Python을 고릅니다.
패키지 목록으로 이 폴더의 `requirements.txt`를 선택합니다. 과정 1에서 이미 만든 환경이 있으면
그 환경을 사용해도 됩니다. 터미널 메뉴 → 새 터미널에서 아래 명령으로 필요한 패키지를 설치할 수도 있습니다.

```text
python -m pip install -r requirements.txt
```

이 명령은 해당 터미널에서 선택한 Python에 설치합니다. 노트북에서도 같은 환경을 커널로 고릅니다.

## 1. Codex로 노트북 만들기

`만들기-요청.txt`를 열어 요청 내용을 읽습니다. 파일 이름, 코드 셀 네 개, 출력은 비우기라는 조건을 확인합니다.
VS Code의 터미널 메뉴 → 새 터미널에서 아래 명령을 실행합니다. 현재 폴더가 `course-02-practice`인지 확인합니다.

```text
codex exec --skip-git-repo-check --sandbox workspace-write - < 만들기-요청.txt
```

위의 `<` 명령은 Bash·zsh용입니다. Windows PowerShell에서는 아래를 사용합니다.

```powershell
Get-Content -Raw -Encoding UTF8 .\만들기-요청.txt | codex exec --skip-git-repo-check --sandbox workspace-write -
```

`exec`는 요청 하나를 처리하고 끝내는 Codex 실행 방식입니다. `--skip-git-repo-check`는 Git 저장소가 아닌
실습 폴더에서도 시작하게 합니다. `workspace-write`는 작업 폴더 안에서 파일을 만들게 하는 설정입니다.
이미 Codex 대화 화면을 쓰고 있다면 같은 실습 폴더에서 요청문 전체를 붙여 넣어도 됩니다.

생성이 끝나면 탐색기의 `notebooks/first-jupyter-notebook.ipynb`를 클릭합니다.
생성 결과가 매번 글자 단위로 같을 필요는 없지만, 설명 셀과 코드 셀 네 개가 있어야 합니다.
아직 출력이 없어야 합니다. 생성이 막히면 별도 제공한 `first-jupyter-notebook.ipynb`를 notebooks 폴더에 넣어 실행부터 따라갈 수 있습니다.

## 2. 커널 선택과 첫 실행

오른쪽 위 Select Kernel → Python Environments에서 프로젝트의 `.venv`를 선택합니다.
커널은 노트북의 Python 코드를 실행하는 프로그램입니다. 선택 목록에서 환경의 이름과 경로를 확인합니다.
첫 코드 셀 왼쪽 ▶를 누릅니다. 셀 아래에 `첫 주피터 노트북 실행에 성공했습니다.`가 나타나야 합니다.
설명 셀은 읽고, 코드 셀은 실행합니다. 코드 셀에서 Shift+Enter로 실행하고 다음 셀로 이동할 수도 있습니다.

## 3. 네 셀을 순서대로 실행

1. 인사말 출력 → 성공 문장
2. 가격 입력 → 기준가격 100, 비교가격 105 (학습용 가상 가격)
3. 변화율 계산 → `가격 변화: 5.0%`
4. CSV 읽기 → `전체 행 수: 12, 전체 열 수: 7`, Date·Close 두 열의 첫 네 행

네 번째 셀의 첫 행: 인덱스 0, Date 2024-01-02, Close 34541.
표는 전체 12행이지만 화면에는 앞 네 행과 두 열만 표시합니다. CSV의 내용을 바꾸지 않습니다.

## 4. 숫자 수정과 재실행

두 번째 코드 셀의 비교가격만 105에서 103으로 고칩니다. 바로 밑 출력은 아직 105일 수 있습니다.
두 번째 코드 셀을 실행하고, 세 번째 코드 셀도 실행합니다. `가격 변화: 3.0%`가 나타나야 합니다.
비교 답안 노트북은 기본값 105의 결과를 담고 있습니다. 따라서 수정 실습의 3.0%와 값이 다릅니다.

## 5. 오류를 Codex와 읽기

Restart로 커널을 재시작한 뒤 세 번째 코드 셀부터 실행해 봅니다.
`NameError: name '비교가격' is not defined`가 예상된 오류입니다. 앞 셀을 실행하지 않아 값이 없습니다.
`복구-요청.txt`에는 실패한 코드, 오류 마지막 줄, 직전 행동이 함께 들어 있습니다.

```text
codex exec --skip-git-repo-check --sandbox read-only - < 복구-요청.txt
```

PowerShell에서는 앞의 예처럼 Get-Content로 요청문을 전달합니다. Codex의 설명을 읽고,
가격 입력 셀 → 변화율 셀 순서로 직접 실행해 3.0%를 확인합니다. 제공한 복구 답변 파일은 이번 실제 응답입니다.

## 6. 마무리

Restart → Run All → 마지막 표 확인 → 저장 순서로 마칩니다. 코드 셀의 실행 번호는 1, 2, 3, 4입니다.
이미 표시된 출력이 있어도 커널 재시작 뒤 변수까지 되살아나는 것은 아닙니다.
답안은 정답 확인용입니다. 자신의 노트북을 새 커널에서 다시 실행해 보세요.

## 추가 실습

notebook-table-reading.ipynb와 table-check-cases.ipynb는 표의 여덟 항목 점검용입니다.
입문 실습을 마친 뒤 선택해서 사용하며 두 파일도 notebooks 폴더에 놓습니다.
메타데이터와 기존 experiment-results.csv는 이 추가 실습을 위한 자료입니다.

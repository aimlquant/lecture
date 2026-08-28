# VS Code 실습 환경 준비 체크리스트

영상의 순서대로 확인한다. 운영체제에 따라 설치 화면과 명령 이름은 조금 다를 수 있다.

## 1. 프로그램과 작업 폴더

- [ ] VS Code를 공식 배포처에서 설치했다.
- [ ] Python을 공식 배포처 또는 운영체제의 신뢰할 수 있는 패키지 경로로 설치했다.
- [ ] `course-01-practice` 폴더를 만들었다.
- [ ] VS Code에서 `File → Open Folder...`로 그 폴더를 열었다.
- [ ] 폴더 신뢰 여부를 확인하고 실습 폴더만 열었다.

## 2. VS Code 확장 기능

- [ ] OpenAI가 게시한 Codex 확장 기능인지 확인했다.
- [ ] Microsoft가 게시한 Python 확장 기능인지 확인했다.
- [ ] Microsoft가 게시한 Jupyter 확장 기능인지 확인했다.
- [ ] 로그인 화면에 나타나는 이메일·인증 코드는 녹화나 공유 화면에서 가렸다.

## 3. 프로젝트 전용 Python 환경

VS Code 터미널에서 다음 명령을 실행한다. 일부 운영체제에서는 `python` 대신 `python3` 또는
`py`를 사용한다.

```text
python -m venv .venv
python -m pip install ipykernel
```

- [ ] 작업 폴더 안에 `.venv`가 생겼다.
- [ ] VS Code의 Python 인터프리터에서 `.venv`를 선택했다.

## 4. Jupyter 노트북

- [ ] `notebooks/environment-check.ipynb`를 만들거나 제공된 노트북을 열었다.
- [ ] 노트북 오른쪽 위에서 `.venv` 커널을 선택했다.
- [ ] `Run All`을 눌렀다.
- [ ] 코드 아래에 `환경 확인 완료`, Python 버전, 작업 폴더가 표시됐다.

## 5. 문제가 생겼을 때

1. 왼쪽 탐색기에 `course-01-practice`가 보이는지 확인한다.
2. Codex·Python·Jupyter 확장 기능의 게시자를 확인한다.
3. `.venv`가 작업 폴더 안에 있는지 확인한다.
4. Python 인터프리터와 노트북 커널이 같은 `.venv`인지 확인한다.
5. 커널을 다시 시작하고 `Run All`을 다시 실행한다.

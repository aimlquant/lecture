# AIML Quant lecture agent guide

## Purpose

- 이 공개 저장소는 강의의 **생성된 HTML·자산과 GitHub Pages 배포**만 관리한다.
- 로드맵, 교안 원문, 내레이션 스크립트, raw 리서치, TTS·영상 하네스는 형제 비공개
  저장소 `../lecture-materials` 가 정본이다.
- 저장소 이름이 공개 URL 경로다: `lecture` → `https://aimlquant.github.io/lecture/`.
- 기본 응답 언어는 한국어로 하되 코드·명령어·고유명사는 원문을 유지한다.

## 강의와 스터디·세미나의 경계

| | 스터디 | 세미나 | 강의 |
|---|---|---|---|
| 원자료 | 비공개 교재 | 공개 1차 자료 | 스터디·세미나에서 검증된 내용의 재구성 |
| 단위 | 회차 = 교재 한 장 | 1주제 완결 | 코스 → 차시 |
| 순서 | 교재 목차가 정본 | 발표자 구성 | **로드맵이 정본** |
| 대상 | 참가자 | 공개 방문자 | 초급~고급이 같은 차시를 함께 |
| 진행 | 사람이 발표 | 사람이 발표 | 교안 + 내레이션(TTS) 영상 |

강의는 **한 차시 안에 핵심(core)과 심화(deep) 두 층** 을 둔다. 초급자는 핵심만 봐도
차시가 완결되고, 고급자는 심화까지 이어서 본다. 코스 자체에는 난이도 라벨을 두지 않고
주제로만 묶는다. 학습 경로는 코스의 `prerequisites` 가 설명한다.

## Repository boundary

```text
lecture/                      public
├── html/                     Pages 에 그대로 배포되는 생성물
├── .github/workflows/        정적 배포
└── AGENTS.md · README.md     공개 경계와 이용 안내

lecture-materials/            private, sibling repository
├── curriculum/               로드맵·코스·차시 정본, 프롬프트, 템플릿
├── raw/                      리서치 응답·메타데이터·해시
├── harness/                  roadmap→courseware→script→tts→compose→publish
└── site/                     공개될 파일의 비공개 생성 원본
```

이 저장소에서 교안·스크립트를 직접 저작하거나 생성기·프롬프트·raw 데이터를 새로
만들지 않는다. 수정이 필요하면 `lecture-materials` 의 정본을 고친 뒤 게시 명령으로
`html/` 을 다시 생성한다.

## Public file contract

```text
html/
├── index.html                          # 로드맵 허브
├── 404.html
├── .nojekyll
├── assets/                             # site.css, favicon.svg
└── courses/<course_id>/
    ├── index.html                      # 코스 개요와 차시 목록
    └── lessons/<lesson_id>/
        ├── index.html                  # 차시 페이지. 영상 임베드와 자료 링크
        ├── report.html                 # 상세 리포트. 학습자가 다시 읽는 텍스트 교재
        ├── slides.html                 # 교안. core 본편 뒤 deep 부록
        ├── notebook.html + notebook.ipynb
        │   또는 worksheet.html + worksheet.md
        └── assets/                     # 이 차시에 귀속된 CSS·JS·figs
```

**공통 세 파일과 종류별 두 파일, 모두 다섯 파일이 한 벌이다.** 공통 파일은
`index.html`·`report.html`·`slides.html` 이다. 차시 정본의 `kind` 가 `notebook` 이면
`notebook.html`·`notebook.ipynb`, `worksheet` 이면 `worksheet.html`·`worksheet.md` 를
더 낸다. `report.html` 은 슬라이드를 만드는 중간 산출물이 아니라 학습자가 다시 읽는
공개 산출물이다. 렌더본과 다운로드 원본 가운데 하나라도 빠지면 게시하지 않는다 —
`lecture-materials` 의 `validate.py` 가 게이트로 강제한다. 코스에는 `index.html` 개요
페이지가 있어야 한다.

검토 공개는 네 단계다. `report`는 `report.html`만, 사용자가 발표자료 검토를 명시적으로
요청한 `slides`는 `report.html`과 대본 없는 `slides.html`만 `noindex`로 공개한다.
`narration`은 같은 두 HTML만 공개하되 정본 대본을 선택형 슬라이드 패널 안에 포함한다.
별도 대본 파일·차시 인덱스·실습·음성·영상은 공개하지 않는다. `bundle`은 위의 다섯 파일
전체이며, 앞선 검토 단계를 완성 강의로 표시하지 않는다.

`course_id` 와 `lesson_id` 는 곧 공개 URL 경로다. **한 번 발행하면 바꾸지 않는다.**
차시 번호와 표시 제목은 `lesson_id` 와 분리된 별도 필드이므로, 순서를 바꿔도 URL 은
그대로 유지된다.

로드맵에 선언된 과정은 상세 강의 제작 전에도 `courses/<course_id>/index.html` 개요를
공개할 수 있다. 이 페이지의 영상 카드는 계획과 순서를 보여 줄 뿐이며, 각 영상의 상세
리포트는 해당 영상의 검토본이 생긴 뒤 연결한다. 슬라이드는 사용자가 공개 검토를 승인한
`slides` 단계부터 연결하고 `narration` 단계에서는 같은 링크에서 내레이션 패널을 선택해
볼 수 있다. 실습 자료는 완성 번들이 생긴 뒤에만 연결한다.

공개 상태는 `review` 와 `published` 를 구분한다. `review` 는 피드백을 받기 위한 직접 URL
공개이며 모든 HTML 에 `noindex, nofollow` 를 넣고 홈에는 노출하지 않는다. 음성·영상·청취
검증과 내용 승인이 끝난 뒤에만 `published` 로 전환한다.

## Base path

Pages 루트는 `/` 가 아니라 `/lecture/` 다. 생성물에서 `/assets/...` 같은 루트 절대경로를
쓰면 조직 랜딩(`aimlquant.github.io`)의 자산을 가리켜 조용히 깨진다. **상대경로 또는
명시적인 `/lecture/...` 만 사용한다.** `lecture-materials` 의 `validate.py` 가 게이트로
강제한다.

## Safety boundaries

1. `youtube_video_id` 는 영상이 승인되어 실제 `public` 이 된 뒤에만 기록한다.
2. private 또는 unlisted video ID, OAuth 토큰, 쿠키, 클라이언트 비밀, 로컬 녹화 경로,
   TTS API 키, 업로드 복구 원장은 이 공개 저장소에 넣지 않는다.
3. 비공개 저장소의 경로·이름·commit 정보를 공개 HTML 에 노출하지 않는다.
4. 오디오·영상 파일(`*.wav`, `*.mp3`, `*.mp4`, `*.mkv`, `*.webm`)과 TTS 캐시, 렌더
   중간물을 이 저장소에 넣지 않는다. 공개 영상은 YouTube 임베드로만 참조한다.
5. **사내 색 토큰 `#A50034` · `#6E0022` 을 어떤 파일에도 남기지 않는다.** 사내 트랙에서
   온 원자료는 옮기기 전에 전수 치환한다.
6. 사내 조직명·내부 제품 식별자·비공개 데모 계정을 공개 산출물에 남기지 않는다.
7. 외부 CDN·외부 폰트·프레임워크에 의존하지 않는다. 차시 폴더만으로 동작해야 한다.
8. 공개 URL 을 은퇴시킬 때는 자동 삭제하지 않는다. 명시적인 retirement 또는 redirect
   결정을 먼저 기록한다.
9. 사용자 변경을 보존하고 관련 없는 파일을 되돌리지 않는다.
10. 커밋, push, Pages 설정 변경은 사용자가 요청한 범위에서만 수행한다.

## Required verification

```bash
test -f html/index.html
test -f html/404.html
git diff --check
```

게시는 형제 비공개 저장소에서 수행한다.

```bash
cd ../lecture-materials
python3 harness/validate.py
python3 harness/publish.py --check
```

HTML·CSS·SVG 를 변경하면 실제 GitHub Pages 표시 크기의 데스크톱·모바일 렌더를
확인한다. 텍스트 잘림, 오버플로, 불균형, 깨진 링크, 영상 프레임 비율을 DOM 검사만으로
판정하지 않는다.

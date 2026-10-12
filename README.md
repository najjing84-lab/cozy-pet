# 나만의 야생동물

손가락 하나로 키우고, 알을 깨서 강아지부터 공룡까지 동물을 모으는 힐링 수집 게임.

- **플레이**: https://najjing84-lab.github.io/cozy-pet/ (휴대폰 브라우저로 열기)
- **기획서**: [docs/](docs/README.md)

## 구조

| 경로 | 내용 |
|---|---|
| `web/config.js` | 게임 이름, 동물, 확률, 가격 등 자주 바꾸는 값 |
| `web/art.js` | 동물 전신 그림(SVG). 동물마다 색, 귀, 꼬리, 특징만 적으면 같은 그림체로 그려짐 |
| `web/game.js` | 게임 동작 |
| `web/style.css` | 화면 꾸미기 |
| `web/index.html` | 화면 뼈대 |
| `.github/workflows/pages.yml` | main에 병합되면 `web/`을 GitHub Pages로 자동 배포 |

빌드 과정이 없어서 `web/index.html`을 브라우저로 바로 열어도 실행됩니다. 진행 상황은 브라우저(localStorage)에 저장됩니다.

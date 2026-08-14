# PuppyMode-Front

PuppyMode Front

> ⚠️ **네이티브 작업 전 필독**: `expo prebuild` 실행 전 [NATIVE_UPGRADE.md](./NATIVE_UPGRADE.md) 필독.
> Windows 개발자는 watchman 설치 필수: `choco install watchman`

### 📦 주요 기술 요약

| 분류                | 기술                                           |
| ------------------- | ---------------------------------------------- |
| **프레임워크**      | React Native 0.79, Expo SDK 53 (Bare Workflow) |
| **언어**            | TypeScript 5.8                                 |
| **라우팅**          | Expo Router 5 (파일 기반)                      |
| **서버 상태**       | TanStack Query v5                              |
| **클라이언트 상태** | Zustand v5                                     |
| **스타일링**        | NativeWind (Tailwind CSS)                      |
| **폼 관리**         | React Hook Form + Zod                          |
| **HTTP**            | Axios                                          |
| **소셜 로그인**     | Kakao, Apple                                   |
| **크래시 리포팅**   | Firebase Crashlytics                           |
| **모킹**            | MSW v2                                         |
| **패키지 매니저**   | npm                                            |
| **CI/CD**           | GitHub Actions                                 |

---

### commit convention

```
🎉 init: 프로젝트 세팅
✨ feat: 새로운 기능
🐛 fix: 버그 수정
🎨 design: UI/스타일 수정
♻️ refactor: 리팩토링
✏️ types: 오타 수정
🚚 rename: 파일/폴더 이동 및 이름 변경
🍱 assets: 이미지, 폰트 등
🔥 del: 파일 삭제
📚 docs: 문서, 목데이터
🔧 chore: 설정, 환경, 라이브러리 관리
🔙 revert: 커밋 복구
🚀 release: 버전 배포
```

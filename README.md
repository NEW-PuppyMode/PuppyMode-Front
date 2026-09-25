# PuppyMode (멍멍멍멍멍)

음주 기록과 절주 목표를 강아지 캐릭터 육성으로 관리하는 모바일 앱의 프론트엔드입니다.
React Native + Expo 기반이며 Android / iOS를 지원합니다.

> ⚠️ **네이티브 작업 전 필독**: `expo prebuild` 실행 전 [NATIVE_UPGRADE.md](./NATIVE_UPGRADE.md) 를 반드시 읽으세요.
> Windows 개발자는 watchman 설치 필수: `choco install watchman`

---

## 📦 기술 스택

| 분류                  | 기술                                                                   |
| --------------------- | ---------------------------------------------------------------------- |
| **프레임워크**        | React Native 0.81.5 / Expo SDK 54                                      |
| **언어**              | TypeScript 5.9                                                         |
| **네이티브 프로젝트** | `android/`·`ios/` 를 저장소에 커밋 — 빌드는 이 폴더를 그대로 사용       |
| **prebuild**          | 상시 실행하지 않음. SDK 업그레이드 시점에만 수동 실행                   |
| **라우팅**            | Expo Router 6 (파일 기반, typed routes)                                |
| **서버 상태**         | TanStack Query v5                                                      |
| **클라이언트 상태**   | React Context (`contexts/AuthContext.tsx`)                             |
| **스타일링**          | NativeWind v2 (Tailwind CSS 3.3) + `styles/theme` 토큰                 |
| **폼 관리**           | React Hook Form + Zod                                                  |
| **HTTP**              | Axios                                                                  |
| **소셜 로그인**       | Kakao, Apple                                                           |
| **푸시 / 분석**       | Firebase Messaging · Notifee / Firebase Analytics · Amplitude          |
| **크래시 리포팅**     | Firebase Crashlytics                                                   |
| **API 모킹**          | MSW v2                                                                 |
| **패키지 매니저**     | npm                                                                    |
| **GitHub Actions**    | 이슈 생성 시 작성자 자동 할당 (빌드·배포 파이프라인은 없음)              |

`app.json` 과 config plugin 수정은 **prebuild를 돌려야** 네이티브에 반영됩니다. 평소에는
`android/`·`ios/` 폴더를 직접 수정하세요. 자세한 규칙은 [NATIVE_UPGRADE.md](./NATIVE_UPGRADE.md) 참고.

> **iOS 주의**: `ios/` 는 아직 SDK 53(RN 0.79.6) 상태이고 JS 의존성만 SDK 54로 올라가 있습니다.
> iOS 마이그레이션은 맥 환경에서 별도 진행 예정입니다. ([NATIVE_UPGRADE.md 4번](./NATIVE_UPGRADE.md))

---

## 🚀 시작하기

### 요구사항

| 항목            | 버전 / 비고                                     |
| --------------- | ----------------------------------------------- |
| Node.js         | 20 이상                                         |
| JDK             | 17 (Android 빌드)                               |
| Android Studio  | SDK / 에뮬레이터                                |
| watchman        | **Windows 필수** — `choco install watchman`     |
| Xcode           | iOS 빌드 시 (macOS 전용, deployment target 15.1) |

### 1. 설치

```bash
git clone https://github.com/NEW-PuppyMode/PuppyMode-Front.git
cd PuppyMode-Front
npm install
```

### 2. 환경변수

```bash
cp .env.example .env        # Windows: copy .env.example .env
```

실제 값은 팀 채널에서 받아 채우세요. 각 변수의 용도는 `.env.example` 주석에 있습니다.

### 3. Android 서명 설정 (릴리즈 빌드 시에만)

`android/gradle.properties` 는 서명 비밀번호를 담고 있어 커밋되지 않습니다.

```bash
cp android/gradle.properties.example android/gradle.properties
```

릴리즈 빌드를 할 사람만 `MYAPP_UPLOAD_*` 4개 값과 keystore 파일을 팀에서 받아 채우면 됩니다.
개발 빌드는 `debug.keystore` 를 쓰므로 그대로 두어도 동작합니다.

### 4. 실행

```bash
npm run android      # expo run:android
npm run ios          # expo run:ios (macOS)
npm start            # Metro만 실행 (이미 빌드된 앱에 붙일 때)
npm run lint
```

`npm run android` 는 `android/` 폴더가 있으면 prebuild를 건너뛰고 기존 네이티브 프로젝트를
그대로 빌드합니다.

---

## 🧪 목(MSW) 개발

서버 없이 특정 상황을 재현할 때 사용합니다.

1. `.env` 에서 `EXPO_PUBLIC_MOCK_ACTIVATE=enable` 주석 해제
2. `EXPO_PUBLIC_MOCK_SCENARIO` 에 시나리오 이름 지정
3. `npx expo start -c` — **Metro 캐시를 지워야** 반영됩니다

끄려면 `EXPO_PUBLIC_MOCK_ACTIVATE` 를 다시 주석 처리하세요. 목은 `__DEV__` 에서만 동작합니다.
사용 가능한 시나리오 목록과 설명은 [mocks/handlers.ts](./mocks/handlers.ts) 의 `scenarios` 를 참고하세요.

---

## 📁 폴더 구조

```
app/           Expo Router 라우트 (파일 = 화면)
components/    common · layout · page · ui 로 구분된 컴포넌트
hooks/         queries · mutations (TanStack Query) + 기능별 훅
services/      Axios 인스턴스 및 API 호출 함수
contexts/      AuthContext 등 전역 상태
constants/     Colors · messages · storage 키
styles/theme/  색상 · 타이포그래피 토큰
types/         모델 및 전역 타입 선언
utils/         analytics · fcm · 날짜 등 순수 유틸
mocks/         MSW 핸들러 및 시나리오
plugins/       Expo config plugin (알림 채널 등)
android/ ios/  커밋된 네이티브 프로젝트
```

---

## 📦 릴리즈 빌드

### Android

```bash
cd android
./gradlew bundleRelease      # AAB (Play Console 업로드용)
```

이 경로는 **prebuild를 거치지 않으므로** `app.json` 변경이 반영되지 않습니다.
`versionCode` / `versionName` 은 [android/app/build.gradle](./android/app/build.gradle) 에서 직접 올립니다.

### iOS

Xcode 에서 Archive. 위 iOS 주의사항을 먼저 확인하세요.

자세한 절차와 주의사항은 [NATIVE_UPGRADE.md](./NATIVE_UPGRADE.md) 에 있습니다.

---

## 📝 컨벤션

### 브랜치

```
<type>/SCRUM-<이슈번호>-<요약>      예: feat/SCRUM-69-edit-user-dog-name
```

기준 브랜치는 `develop` 입니다.

### 커밋

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
🔙 revert: 커밋 복구
🚀 release: 버전 배포
```

메시지 끝에 Jira 이슈 키를 붙입니다. 예: `✨ feat: 설정 화면 - 강아지 이름 수정 기능 추가 (SCRUM-69)`

### PR

[PR 템플릿](./.github/PULL_REQUEST_TEMPLATE.md) 을 따릅니다. 제목은 이슈와 동일하게 쓰고 뒤에 이슈 키를 붙입니다.

---

## 📚 관련 문서

- [NATIVE_UPGRADE.md](./NATIVE_UPGRADE.md) — 네이티브 폴더 관리 · prebuild · SDK 업그레이드 플레이북
- [mocks/handlers.ts](./mocks/handlers.ts) — MSW 시나리오 목록
- Jira: https://mungx5.atlassian.net/browse/SCRUM

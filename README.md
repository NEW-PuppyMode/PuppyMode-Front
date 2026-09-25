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

패키지를 새로 추가할 때는 `npx expo install <패키지>` 를 쓰세요. SDK 54 와 호환되는
버전으로 맞춰 설치됩니다. 인자 없이 `npx expo install` 만 실행하면 `npm install` 과 같습니다.

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
# 최초 1회 · 네이티브 코드나 의존성이 바뀌었을 때 (첫 빌드 10~20분)
npx expo run:android          # 빌드 → 기기·에뮬레이터 설치 → Metro 자동 실행

# 이후 JS 만 수정할 때
npx expo start --dev-client   # Metro 만 실행, 설치된 앱이 여기에 붙음
```

- `run:android` 가 Metro 를 함께 띄우므로 앞에 `expo start` 를 따로 실행할 필요는 없습니다.
- `--dev-client` 는 Expo Go 가 아니라 `run:android` 로 설치한 앱에 연결하라는 뜻입니다.
- `.env` 나 MSW 시나리오를 바꿨다면 캐시를 지웁니다 → `npx expo start -c --dev-client`
- `npx expo run:ios` 는 macOS 전용입니다. 위 iOS 주의사항을 먼저 확인하세요.
- `npm run android` · `npm run ios` · `npm start` · `npm run lint` 는 각각의 단축 스크립트입니다.

`npx expo run:android` 는 `android/` 폴더가 있으면 prebuild를 건너뛰고 기존 네이티브
프로젝트를 그대로 빌드합니다.

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

모든 명령은 **프로젝트 루트**에서 시작합니다.

```bash
rm -rf android/app/build     # 이전 빌드 산출물 제거 (JS 번들 · 리소스 · 이전 AAB)
cd android
./gradlew bundleRelease      # AAB (Play Console 업로드용)
```

릴리즈 AAB 는 대부분 그대로 업로드하므로, 이전 빌드가 섞이지 않도록
`android/app/build` 를 지우고 시작합니다.

네이티브 의존성을 추가·제거했거나 SDK · NDK 버전을 바꿨다면 네이티브 빌드 캐시까지 지웁니다.
C++ 재컴파일이 들어가 빌드가 오래 걸리므로, 해당할 때만 실행하세요.

```bash
rm -rf android/app/build android/app/.cxx android/build
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

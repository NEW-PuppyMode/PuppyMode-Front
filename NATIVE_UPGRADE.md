# 네이티브 업그레이드 가이드 (Android / iOS)

> ⚠️ **먼저 읽으세요. `npx expo prebuild --clean`을 아무 생각 없이 실행하면 안 됩니다.**
> 이 레포는 `android/`·`ios/` **네이티브 폴더를 git에 커밋**하면서 동시에 **Expo config plugin**도 씁니다.
> prebuild는 네이티브 폴더를 통째로 재생성하므로, **손으로 넣은 커스텀(서명 설정, maven 저장소, iOS 패치 등)이 전부 사라집니다.**
> 백업 없이 실행하면 릴리즈 서명키 참조·카카오/알림 빌드 설정이 날아가 빌드가 깨집니다.

---

## 0. 이 프로젝트의 워크플로 (왜 조심해야 하나)

이 프로젝트는 순수 CNG도, 순수 bare도 아닌 **하이브리드**입니다.

| 용도 | 명령 | prebuild 실행? |
|------|------|:-:|
| 개발 | `npx expo run:android` / `expo start` | ✅ 내부에서 prebuild가 돎 → config plugin 적용됨 |
| 릴리즈 | `cd android && ./gradlew bundleRelease` | ❌ 안 돎 → 커밋된 `android/` 폴더를 그대로 빌드 |

즉 **릴리즈는 디스크의 네이티브 폴더가 단일 진실 공급원**입니다. 그래서 네이티브 폴더를 커밋해두고, 필요한 커스텀도 그 안에 직접 넣어둡니다.
`prebuild --clean`은 **연 1회 SDK 업그레이드 같은 큰 변화 때만** 쓰고, 그 외에는 네이티브 폴더를 손으로 관리합니다.

---

## 1. 단일 진실 공급원 규칙 (SSOT, Single Source of Truth)

prebuild가 지워도 자동 복구되도록, **오래 가는 설정은 `app.json`에 넣어둡니다.**

| 항목 | 관리 위치 | 비고 |
|------|-----------|------|
| deep link scheme (`puppymode`, `puppymod`) | `app.json` `scheme` 배열 | prebuild 자동 반영 |
| `google-services.json` | 루트 파일 + `app.json` `android.googleServicesFile` | prebuild가 자동 배치 |
| Kotlin 버전 | `app.json` kakao-login 플러그인 `kotlinVersion` | 아래 3-C 참고 |
| Firebase / kakao AppKey / 알림 채널 | config plugin (자동) | 손댈 필요 없음 |
| **versionCode / versionName** | **`android/app/build.gradle`에서 직접 관리** | ⚠️ 아래 참고 |

**versionCode는 일부러 `app.json`에 안 넣습니다.**
릴리즈(`gradlew bundleRelease`)가 prebuild를 안 거쳐서 `app.json` 값이 어차피 반영되지 않고, 배포 때마다 build.gradle에서 올리는 게 실제로 나가는 값이기 때문입니다.
→ **prebuild --clean 후에는 Play Console의 최신 versionCode를 확인해 build.gradle에 맞춰주세요.** (리셋되면 업로드 거부됨)

---

## 2. `prebuild --clean` 실행 전 — 백업 (Android)

아래는 **git에 없어서(보안상 gitignore) 지우면 복구 불가**합니다. 안전한 위치에 반드시 복사해두세요.

- `android/app/my-release-key.keystore` — **릴리즈 업로드 서명키. 분실 시 앱 업데이트 영구 불가.**
- `android/gradle.properties` — 서명 비밀번호 4종(`MYAPP_UPLOAD_*`) 포함

> 이 파일들은 시크릿이므로 이 문서나 레포에 절대 커밋하지 마세요. 팀 비밀번호 관리처/보안 저장소에 둡니다.

---

## 3. `prebuild --clean` 후 — 복원 체크리스트 (Android · 검증됨)

`npx expo prebuild --clean --platform android` 실행 후 아래를 순서대로 복원합니다.
(**iOS는 함께 돌리지 마세요.** 4번 참고.)

### 3-A. 릴리즈 keystore 복원
```bash
cp <백업위치>/my-release-key.keystore android/app/
```

### 3-B. gradle.properties에 서명 정보 추가
새로 생성된 `android/gradle.properties` 끝에 백업본의 서명 블록을 붙여넣습니다(값은 백업본 참조):
```properties
MYAPP_UPLOAD_STORE_FILE=my-release-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=...
MYAPP_UPLOAD_STORE_PASSWORD=...
MYAPP_UPLOAD_KEY_PASSWORD=...
```

### 3-C. android/app/build.gradle — release 서명 재적용
prebuild는 release 서명을 `debug`로 리셋합니다. `signingConfigs`에 release를 추가하고 buildTypes.release가 그걸 쓰도록 고칩니다:
```groovy
signingConfigs {
    debug { /* 생성된 그대로 */ }
    release {
        if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
            storeFile file(MYAPP_UPLOAD_STORE_FILE)
            storePassword MYAPP_UPLOAD_STORE_PASSWORD
            keyAlias MYAPP_UPLOAD_KEY_ALIAS
            keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release   // ← debug로 되어 있으면 교체
        ...
    }
}
```
그리고 `versionCode`를 Play Console 최신값에 맞춥니다(1로 리셋됐을 수 있음).

### 3-D. android/build.gradle — maven 저장소 2개 재추가 (필수)
없으면 `app.notifee:core:+` / `com.kakao.sdk:v2-*` 의존성 해결 실패로 빌드가 깨집니다.
```groovy
allprojects {
  repositories {
    google()
    mavenCentral()
    maven { url 'https://www.jitpack.io' }
    maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }  // notifee
    maven { url 'https://devrepo.kakao.com/nexus/content/groups/public/' }        // kakao SDK
  }
}
```

### 3-E. Kotlin 버전 (app.json으로 이관 완료 → 보통 자동)
kakao-login 플러그인이 기본으로 낡은 Kotlin `1.5.10`을 주입해 SDK 54의 KSP와 충돌합니다.
이를 막으려 `app.json`의 kakao-login 플러그인에 `"kotlinVersion": "2.1.20"`(= RN 0.81 기본)을 지정해 두었습니다.
prebuild 후 `android/gradle.properties`·`android/build.gradle`에 여전히 `1.5.10`이 보이면 `2.1.20`으로 바꿔주세요.

### 3-F. 검증
```bash
grep -nE "targetSdkVersion|compileSdk" node_modules/react-native/gradle/libs.versions.toml   # 36 확인
npx expo run:android
cd android && ./gradlew bundleRelease && cd ..
```

---

## 4. iOS — 아직 SDK 54 미마이그레이션

**현재 상태:** `ios/`는 SDK 53(React Native 0.79.6) 그대로이고, JS/node_modules만 SDK 54(RN 0.81.5)로 올라가 서로 어긋난 상태입니다.
이 상태로도 기존 iOS 릴리즈는 지금까지 하던 방식(Xcode Archive 등) 그대로 나가지만, **iOS를 SDK 54로 맞추는 작업은 아직 수행되지 않았습니다.** 이 작업은 맥 환경이 필요합니다(Windows에서 iOS 빌드·테스트 불가).

### 4-1. `prebuild --clean`을 iOS에 단독 실행하지 말 것

`ios/`에는 config plugin으로 재생성되지 않는 **수동 패치**가 있어, `prebuild --clean`을 돌리면 아래가 사라지고 빌드/서명이 깨집니다. Android보다 복구가 어렵습니다(인증서·프로비저닝·CocoaPods 관여).

보존해야 하는 수동 커스텀:
- **Xcode 16+ `fmt` 컴파일 에러 패치** (git: `e9e13fa`)
- **애플 로그인 entitlements** — `expo-apple-authentication`이 `app.json` plugins에 없어 수동 설정됨 (6번 TODO에서 이관 시 해소)
- **pbxproj 수동 편집** (빌드 설정, Firebase 연동 등)
- `Podfile.lock` (현재 RN 0.79.6 기준) — 업그레이드 시 재생성됨

### 4-2. iOS SDK 54 마이그레이션 절차 (맥 환경, 미검증)

Android(3번)와 동일한 "재생성 → 복원 → 검증" 골격입니다. 아래는 아직 실제로 수행·검증되지 않았으므로, 진행하며 막히는 지점을 기록하고 검증된 절차로 이 절을 갱신하세요.

1. 시작 전 `ios/` 전체와 위 4-1 수동 패치를 백업(브랜치 분리 또는 폴더 복사).
2. 의존성은 이미 SDK 54 정렬됨(2번에서 완료). 추가로 iOS 전용 패키지 버전만 `npx expo install --fix`로 재확인.
3. 네이티브 재생성:
   ```bash
   npx expo prebuild --clean --platform ios
   cd ios && pod install && cd ..
   ```
4. 4-1의 수동 패치 재적용(Xcode fmt 패치, 애플 로그인 entitlements, pbxproj 설정, 서명/프로비저닝).
5. 검증: `npx expo run:ios`(또는 Xcode Archive)로 빌드 → 애플 로그인·푸시 알림·주요 화면 확인.
6. 검증 완료 후, 실제로 통과한 절차/주의점을 이 4-2에 반영.

---

## 5. 연간 SDK 업그레이드 플레이북

이번 SDK 53→54 업그레이드에서 실제로 통과한 순서입니다.

1. **사전 요건**
   - Node ≥ 20.19.4 (metro 요구). 현재 Node 22 사용.
   - Windows는 **watchman 필수** (없으면 `expo start`의 metro 워처가 타임아웃). `choco install watchman`.
2. **의존성 업그레이드**
   ```bash
   npx expo install expo@^<새버전> --fix
   ```
   - `overrides`/`resolutions` 충돌 나면 낡은 핀부터 정리 (예: 과거 크래시용 `safe-area-context` override 삭제).
   - `@types/react` 등 devDependency가 peer 요구와 안 맞으면 SDK가 요구하는 버전으로 상향.
3. **네이티브 재생성 (Android만)**
   ```bash
   npx expo prebuild --clean --platform android
   ```
   → 이후 **3번 복원 체크리스트** 전부 수행.
4. **빌드 캐시 주의**
   - node_modules를 지웠다 재설치했다면, 낡은 CMake 캐시가 깨지므로 함께 삭제:
     ```bash
     rm -rf android/app/.cxx android/app/build android/build
     ```
   - (`gradlew clean`이 `codegen jni ... not an existing directory` / `GLOB mismatch`로 실패하면 이게 원인)
5. **검증**
   - `npx expo start -c` → 번들 성공 확인 (`babel-preset-expo` 등 누락 시 `npx expo install <pkg>`로 루트 설치)
   - `npx expo run:android` → 실기기에서 카카오 로그인·푸시 알림·주요 화면 확인
   - `./gradlew bundleRelease` → `android/app/build/outputs/bundle/release/app-release.aab` 생성 확인 (서명·targetSdk)
6. **커밋**

---

## 6. TODO — 수동 복원 surface 줄이기 (선택)

아래를 config로 이관하면 3번 복원 단계가 줄어듭니다.

- [ ] notifee/kakao **maven 저장소**를 `expo-build-properties`의 `android.extraMavenRepos`로 이관 → prebuild가 자동 유지 (3-D 제거 가능). `expo-build-properties`는 이미 설치되어 있음.
- [ ] release **signingConfig**를 커스텀 config plugin으로 주입 → prebuild 후 3-C 수동 편집 제거.
- [ ] `expo-apple-authentication`을 `app.json` plugins에 추가 → iOS entitlements 수동 설정 제거.

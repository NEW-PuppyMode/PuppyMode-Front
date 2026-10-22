import * as SplashScreen from 'expo-splash-screen';

/**
 * 앱 진입 시 네이티브 스플래시를 첫 화면이 그려질 준비가 될 때까지 유지한다.
 *
 * expo-router는 첫 렌더 직후 스플래시를 내리는데, 그 뒤 index(/auth/me)와
 * 홈(/main)이 응답을 기다리는 동안 흰 화면이 보였다. 그래서 자동으로 내리지 않고
 * 도착한 화면이 hideSplash()를 부를 때 내린다.
 *
 * index에서 내리면 안 된다. index는 아무것도 그리지 않아서, 다음 화면이 처음
 * 그려지기까지(로그인 화면 기준 약 1초) 흰 화면이 그대로 보인다.
 *
 * 내리는 곳: 로그인, 강아지 유형 검사 시작, 온보딩·튜토리얼(진입 값이 정해진 뒤),
 * 홈(데이터 도착·에러), 목표 갱신 화면.
 * 어느 경로에서도 부르지 못하는 경우를 대비해 일정 시간 뒤에는 무조건 내린다.
 */
const FALLBACK_HIDE_MS = 10_000;

let hidden = false;

export function holdSplash() {
  SplashScreen.preventAutoHideAsync().catch(() => {});
  setTimeout(hideSplash, FALLBACK_HIDE_MS);
}

/** 여러 화면에서 불러도 한 번만 내린다. 앱 실행 중 다시 불려도 아무 일도 없다. */
export function hideSplash() {
  if (hidden) return;
  hidden = true;
  SplashScreen.hideAsync().catch(() => {});
}

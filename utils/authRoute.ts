import type { MeResult } from '@/services/auth';
import type { Href } from 'expo-router';

/**
 * /auth/me 응답 하나로 앱 진입 시 갈 화면을 정한다.
 *
 * 예전에는 이 판정이 signin(isNewUser) · index(isOnboarded) · home(목표·이름 플래그)
 * 세 곳에 흩어져 있어서, 홈까지 갔다가 온보딩으로 되돌아오거나 로그인 응답만 믿고
 * 이미 끝낸 단계를 다시 보여주는 문제가 있었다. 판정은 여기 한 곳에만 둔다.
 *
 * 주의: 월간 목표 갱신은 여기서 판정하지 않는다. onboardingCompleted는 "최초"
 * 목표 설정만 가리켜서 매월 돌아오는 갱신을 잡아내지 못하고, 갱신 여부(main의
 * isGoal)는 홈이 어차피 받는 데이터라 홈에서 판정하는 편이 요청이 늘지 않는다.
 */
export function resolveNextRoute(me: MeResult): Href {
  // 구버전 호환 필드가 강아지 유형 검사 완료 여부와 같은 값이다.
  // 둘 다 없으면 "완료"로 본다. 미완료로 잘못 판정하면 이미 검사를 마친 사용자를
  // 다시 검사로 보내 강아지 종이 바뀌는데, 이건 되돌릴 수 없다.
  const puppyTestCompleted = me.isPuppyTestCompleted ?? me.isOnboarded ?? true;

  // 필드가 없으면 "이미 마친 것"으로 본다. 서버 배포가 늦어 값이 빠졌을 때
  // 기존 사용자에게 온보딩·튜토리얼을 다시 보여주는 쪽이 더 나쁜 실패다.
  const onboardingCompleted = me.onboardingCompleted ?? true;
  const tutorialShown = me.tutorialShown ?? true;

  if (!puppyTestCompleted) return '/test/start';
  if (!onboardingCompleted) return '/onboarding';
  if (!tutorialShown) return '/tutorial';
  return '/home';
}

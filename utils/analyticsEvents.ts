/**
 * 이벤트 이름과 속성의 단일 정의.
 *
 * 이벤트명을 호출부에 문자열로 흩뿌리면 오타를 잡을 수 없고, 같은 이벤트의
 * 속성 이름이 화면마다 조금씩 달라진다. 여기 한 곳에만 적어두고
 * utils/analytics.ts 의 logEvent가 타입으로 강제한다.
 *
 * 속성이 없는 이벤트는 값을 undefined로 둔다. (logEvent의 인자도 함께 사라진다)
 */

export type LoginProvider = 'kakao' | 'apple';

export type AnalyticsEventMap = {
  // ===== 인증 =====
  /** 소셜 로그인 성공. 토큰으로 자동 로그인된 경우는 제외한다. */
  login_completed: {
    provider: LoginProvider;
    /**
     * 서버 응답의 isNewUser. 탈퇴 후 재가입에서 실제 상태와 어긋날 수 있어
     * 참고용으로만 본다. (app/signin.tsx 의 라우팅도 이 값을 쓰지 않는다)
     */
    is_new_user: boolean;
  };
  logout: undefined;
  account_deleted: undefined;

  // ===== 온보딩 =====
  /** 유형 테스트 각 문항 답변. 뒤로가기로 다시 답하면 중복 발생 → 사용자 수로 집계한다. */
  puppy_test_question_answered: { question_number: number };
  puppy_test_completed: { dog_type: string };
  name_set: { target: 'dog' | 'user'; source: 'onboarding' | 'home' };
  tutorial_step_completed: { step_number: number };
  /** 튜토리얼까지 마치고 홈으로 진입 = 신규 사용자 여정의 끝 */
  onboarding_completed: undefined;

  // ===== 목표 설정 =====
  goal_setup_completed: {
    entry_point: 'onboarding' | 'renewal' | 'home';
    goal_type: 'same' | 'new';
    monthly_goal: number;
  };

  // ===== 핵심 행동 =====
  drink_record_created: {
    drank: boolean;
    source: 'tutorial' | 'home';
    record_day: 'today' | 'yesterday';
  };
  dog_advice_received: undefined;
  puppy_level_up: { to_level: number; did_evolve: boolean };

  // ===== 조회 및 리포트 =====
  /** 캘린더에서 월 선택 모달로 다른 달을 확정한 시점 */
  calendar_month_changed: { month_offset: number };
  report_viewed: { achievement_rate: number };

  // ===== 설정 및 알림 =====
  notification_setting_changed: { enabled: boolean };
  notification_permission_responded: { granted: boolean };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

/**
 * 사용자 속성. 앱 실행마다 다시 세팅해서 최신 값으로 덮는다.
 * (Amplitude의 사용자 속성은 마지막에 세팅된 값만 남는다)
 */
export type AnalyticsUserProps = {
  /** 강아지 유형 영문 코드(puppyBreedEn) */
  dog_type: string;
  login_provider: LoginProvider;
  current_monthly_goal: number;
  notification_setting: boolean;
  notification_permission: boolean;
};

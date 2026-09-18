export const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  AUTH_HEADER_KEY: 'Authorization',
  PROVIDER: 'provider',
  // 유형 검사 결과의 영문 코드. 서버 응답 어디에도 없어 분석 속성용으로 캐시한다.
  DOG_TYPE: 'dogType',
  // OS 알림 권한을 이 설치에서 물어본 적 있는지. 계정이 아니라 기기 단위라
  // 로그아웃해도 지우지 않는다.
  NOTIF_PERMISSION_ASKED: 'notifPermissionAsked',
};

const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * 백그라운드/종료 상태에서 FCM이 알림을 표시할 때 사용할 기본 채널 id를 지정한다.
 * 이 값이 없으면 OS가 IMPORTANCE_DEFAULT인 fallback 채널을 써서 헤드업 배너가 뜨지 않는다.
 * 앱이 런타임에 생성하는 채널 id(utils/fcm.ts의 DEFAULT_CHANNEL_ID = 'default')와 일치해야 한다.
 *
 * @react-native-firebase/messaging이 같은 meta-data를 빈 값으로 미리 선언하므로,
 * tools:replace로 값을 덮어써서 매니페스트 머지 충돌을 막는다.
 */
const META_NAME = 'com.google.firebase.messaging.default_notification_channel_id';
const CHANNEL_ID = 'default';

module.exports = function withDefaultNotificationChannel(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;

    // tools 네임스페이스 보장
    manifest.$ = manifest.$ || {};
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    const application = manifest.application?.[0];
    if (!application) return cfg;

    application['meta-data'] = application['meta-data'] || [];
    const metaData = application['meta-data'];

    let item = metaData.find((m) => m.$?.['android:name'] === META_NAME);
    if (!item) {
      item = { $: { 'android:name': META_NAME } };
      metaData.push(item);
    }

    item.$['android:value'] = CHANNEL_ID;
    item.$['tools:replace'] = 'android:value';

    return cfg;
  });
};

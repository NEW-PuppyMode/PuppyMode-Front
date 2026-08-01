import { StyleSheet, Text, View } from 'react-native';

/**
 * 튜토리얼 코치마크 말풍선.
 *
 * 홈의 SpeechBubble과 달리 흰 카드 + 좌/우 치우친 꼬리 형태라 별도 컴포넌트로 둔다.
 * 꼬리 방향(placement)과 좌우 정렬(align)은 스포트라이트 대상의 실제 위치에서
 * TutorialOverlay가 계산해 내려준다.
 */

const TAIL_SIZE = 8;
// 꼬리가 카드 모서리에 딱 붙지 않도록 살짝 안쪽으로
const TAIL_INSET = 22;

type Props = {
  title: string;
  description: string;
  /** 초록색 행동 유도 문구. 없으면 렌더하지 않는다. */
  action?: string;
  /** 대상의 위(above)에 뜨는지 아래(below)에 뜨는지. 꼬리 방향이 반대가 된다. */
  placement?: 'above' | 'below';
  align?: 'left' | 'right';
};

export function CoachTooltip({
  title,
  description,
  action,
  placement = 'above',
  align = 'left',
}: Props) {
  const tailPosition = {
    alignSelf: align === 'right' ? ('flex-end' as const) : ('flex-start' as const),
    marginLeft: align === 'right' ? 0 : TAIL_INSET,
    marginRight: align === 'right' ? TAIL_INSET : 0,
  };

  return (
    <View>
      {placement === 'below' && (
        <View style={[styles.tailBase, tailPosition, styles.tailUp]} />
      )}

      <View style={styles.card}>
        <Text style={[styles.title, styles.center]}>{title}</Text>
        <Text style={[styles.description, styles.center]}>{description}</Text>
        {!!action && <Text style={[styles.action, styles.center]}>{action}</Text>}
      </View>

      {placement === 'above' && (
        <View style={[styles.tailBase, tailPosition, styles.tailDown]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  center: {
    textAlign: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17.6,
    color: '#3C3C3C',
  },
  description: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#3C3C3C',
  },
  action: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17.6,
    color: '#0FD380',
  },
  tailBase: {
    width: 0,
    height: 0,
    borderLeftWidth: TAIL_SIZE,
    borderRightWidth: TAIL_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  tailDown: {
    borderTopWidth: TAIL_SIZE,
    borderTopColor: '#FFFFFF',
    marginTop: -1,
  },
  tailUp: {
    borderBottomWidth: TAIL_SIZE,
    borderBottomColor: '#FFFFFF',
    marginBottom: -1,
  },
});

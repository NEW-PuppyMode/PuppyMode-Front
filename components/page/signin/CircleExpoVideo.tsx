import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

// expo-video 기반 원형 비디오 컴포넌트
// - 원형 마스크: 컨테이너 borderRadius + overflow: 'hidden'
// - 채우기: contentFit="cover"
// - 위치 미세조정: translateX/translateY, 확대: scale

type Source = number | { uri: string };

type CircleExpoVideoProps = {
  source: Source;
  size: number; // 지름(px)
  translateX?: number; // px
  translateY?: number; // px
  scale?: number; // 배율
  borderWidth?: number;
  borderColor?: string;
  style?: ViewStyle;
};

export default function CircleExpoVideo({
  source,
  size,
  translateX = 0,
  translateY = 0,
  scale = 1,
  borderWidth = 0,
  borderColor = 'transparent',
  style,
}: CircleExpoVideoProps) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const videoStyle = useMemo(
    () => [
      styles.video,
      { transform: [{ translateX }, { translateY }, { scale }] },
    ],
    [translateX, translateY, scale],
  );

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor,
        },
        style,
      ]}
    >
      <VideoView
        player={player}
        style={videoStyle}
        pointerEvents='none'
        accessible={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        contentFit='cover'
      />
      {/* VideoView 터치 불가하게끔 */}
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents='auto'
        accessible={false}
        importantForAccessibility='no-hide-descendants'
        onStartShouldSetResponder={() => true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

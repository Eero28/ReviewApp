import React, { FC, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { screenHeight } from '../helpers/dimensions';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../providers/ThemeContext';
interface BottomSheetProps {
  isOpen: boolean;
  snapPoints: string[];
  handleColor?: string;
  onClose: () => void;
  children?: React.ReactNode;
  handleTitle?: string;
}

const BottomSheetScrollView: FC<BottomSheetProps> = ({
  isOpen,
  snapPoints,
  handleColor = 'gray',
  onClose,
  children,
  handleTitle = '',
}) => {

  const { colors, fonts } = useTheme()

  const snapPositions = snapPoints.map((point) => parseFloat(point.replace('%', '')) / 100);
  const closeHeight = screenHeight;
  const translateY = useSharedValue(closeHeight);
  const context = useSharedValue(0);

  const scrollY = useSharedValue(0);

  useEffect(() => {
    const targetHeight = isOpen
      ? screenHeight - screenHeight * snapPositions[0]
      : closeHeight;

    translateY.value = withSpring(targetHeight, { damping: 100, stiffness: 400 });
  }, [isOpen]);

  // Pan gesture for handle
  const pan = Gesture.Pan()
    .onBegin(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = Math.max(context.value + event.translationY, 0);
    })
    .onEnd(() => {
      const closestSnap = snapPositions.reduce((prev, curr) => {
        const prevDist = Math.abs(translateY.value - (screenHeight - screenHeight * prev));
        const currDist = Math.abs(translateY.value - (screenHeight - screenHeight * curr));
        return currDist < prevDist ? curr : prev;
      });

      const finalPosition = screenHeight - screenHeight * closestSnap;
      translateY.value = withSpring(finalPosition, { damping: 20, stiffness: 150, mass: 1 });

      if (closestSnap === Math.min(...snapPositions)) {
        scheduleOnRN(onClose);
      }
    });

  // Pan gesture for scroll interaction
  const panScroll = Gesture.Pan()
    .onBegin(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      if (scrollY.value <= 0 && event.translationY > 0) {
        translateY.value = Math.max(context.value + event.translationY, 0);
      }
    })
    .onEnd(() => {
      if (scrollY.value <= 0) {
        const closestSnap = snapPositions.reduce((prev, curr) => {
          const prevDist = Math.abs(translateY.value - (screenHeight - screenHeight * prev));
          const currDist = Math.abs(translateY.value - (screenHeight - screenHeight * curr));
          return currDist < prevDist ? curr : prev;
        });

        const finalPosition = screenHeight - screenHeight * closestSnap;
        translateY.value = withSpring(finalPosition, { damping: 20, stiffness: 150, mass: 1 });

        if (closestSnap === Math.min(...snapPositions)) {
          scheduleOnRN(onClose);
        }
      }
    });

  const scrollViewGesture = Gesture.Native();

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, animatedStyle, { backgroundColor: colors.modalDialog.bg }]}>
        <View style={styles.lineContainer}>
          <View style={[styles.line, { backgroundColor: handleColor }]} />
          <Text style={[styles.text, { color: colors.textColorPrimary, fontFamily: fonts.semiBold }]}>{handleTitle}</Text>
        </View>

        <GestureDetector gesture={Gesture.Simultaneous(panScroll, scrollViewGesture)}>
          <Animated.ScrollView
            scrollEventThrottle={16}
            bounces={false}
            onScroll={onScroll}
            contentContainerStyle={styles.scrollContent}
          >
            {children}
          </Animated.ScrollView>
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight,
  },
  lineContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    width: 50,
    height: 6,
    borderRadius: 20,
  },
  scrollContent: {
    paddingBottom: 65,
  },
  text: {
    color: 'whitesmoke',
    fontSize: 18
  },
});

export default BottomSheetScrollView;

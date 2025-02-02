import React, { FC, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { screenHeight } from '../helpers/dimensions'; // Use screen height
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

interface BottomSheetProps {
  isOpen: boolean;
  snapPoints: string[]; 
  backgroundColor: string;
  handleColor?: string;
  onClose: () => void;
  children?: React.ReactNode;
  handleTitle?: string;
}

const BottomSheetScrollView: FC<BottomSheetProps> = ({
  isOpen,
  snapPoints,
  backgroundColor,
  handleColor = 'gray',
  onClose,
  children,
  handleTitle = ""
}) => {
  const snapPositions = snapPoints.map((point) => parseFloat(point.replace('%', '')) / 100);
  const closeHeight = screenHeight;
  const translateY = useSharedValue(closeHeight);
  const context = useSharedValue(0);

  const scrollBegin = useSharedValue(0);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    const targetHeight = isOpen
      ? screenHeight - screenHeight * snapPositions[0]
      : closeHeight;

    translateY.value = withSpring(targetHeight, { damping: 100, stiffness: 400 });
  }, [isOpen]);

  // Pan gesture handler
  const pan = Gesture.Pan()
    .onBegin(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      const newTranslateY = context.value + event.translationY;
      
      translateY.value = Math.max(newTranslateY, 0);
    })
    .onEnd(() => {
      // Adjust responsiveness for fast drags by using `withTiming` instead of `withSpring`
      const closestSnap = snapPositions.reduce((prev, curr) => {
        const prevDistance = Math.abs(translateY.value - (screenHeight - screenHeight * prev));
        const currDistance = Math.abs(translateY.value - (screenHeight - screenHeight * curr));
        return currDistance < prevDistance ? curr : prev;
      });

      translateY.value = withTiming(screenHeight - screenHeight * closestSnap, {
        duration: 200, 
        easing: (t) => t, 
      });

      const lowestPosition = Math.min(...snapPositions);
      if (closestSnap === lowestPosition) {
        runOnJS(onClose)(); 
      }
    });

  // Scroll gesture handler
  const onScroll = useAnimatedScrollHandler({
    onBeginDrag: (event) => {
      scrollBegin.value = event.contentOffset.y;
    },
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Pan gesture handler for scroll interaction
  const panScroll = Gesture.Pan()
    .onBegin(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      // Only allow the pan gesture if scrollY is 0 or negative
      if (scrollY.value <= 0 && event.translationY > 0) {
        const newTranslateY = context.value + event.translationY;
        translateY.value = Math.max(newTranslateY, 0);
      }
    })
    .onEnd(() => {
      if (scrollY.value <= 0) {
        const closestSnap = snapPositions.reduce((prev, curr) => {
          const prevDistance = Math.abs(translateY.value - (screenHeight - screenHeight * prev));
          const currDistance = Math.abs(translateY.value - (screenHeight - screenHeight * curr));
          return currDistance < prevDistance ? curr : prev;
        });

        translateY.value = withTiming(screenHeight - screenHeight * closestSnap, {
          duration: 200,
          easing: (t) => t, 
        });
        const lowestPosition = Math.min(...snapPositions);
        if (closestSnap === lowestPosition) {
          runOnJS(onClose)(); 
        }
      }
    });

  const scrollViewGesture = Gesture.Native();

  // Animated style for the bottom sheet container
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, animatedStyle, { backgroundColor }]}>
        <View style={styles.lineContainer}>
          <View style={[styles.line,{backgroundColor: handleColor}]} />
          <Text style={styles.text}>{handleTitle}</Text>
        </View>
        <GestureDetector
          gesture={Gesture.Simultaneous(panScroll, scrollViewGesture)}
        >
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
    padding: 10,
    fontFamily: 'poppins',
    color: 'whitesmoke'
  },
});

export default BottomSheetScrollView;

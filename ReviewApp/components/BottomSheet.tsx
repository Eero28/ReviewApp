import React, { FC } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { screenHeight } from '../helpers/dimensions'; // Use screen height
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

interface BottomSheetProps {
  isOpen: boolean;
  snapPoints: string[]; // Array of snap points (e.g. ['0%', '50%', '100%'])
  backgroundColor: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const BottomSheet: FC<BottomSheetProps> = ({
  isOpen,
  snapPoints,
  backgroundColor,
  onClose,
  children,
}) => {
  const snapPositions = snapPoints.map((point) => parseFloat(point.replace('%', '')) / 100);
  const closeHeight = screenHeight;
  const translateY = useSharedValue(closeHeight);
  const context = useSharedValue(0);

  const scrollBegin = useSharedValue(0);
  const scrollY = useSharedValue(0);

  React.useEffect(() => {
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
      translateY.value = Math.max(newTranslateY, 0); // Clamp to 0 to avoid going out of bounds
    })
    .onEnd(() => {
      // Calculate the closest snap point based on the final translation
      const closestSnap = snapPositions.reduce((prev, curr) => {
        const prevDistance = Math.abs(translateY.value - (screenHeight - screenHeight * prev));
        const currDistance = Math.abs(translateY.value - (screenHeight - screenHeight * curr));
        return currDistance < prevDistance ? curr : prev;
      });

      translateY.value = withSpring(screenHeight - screenHeight * closestSnap, {
        damping: 100,
        stiffness: 400,
      });

      const lowestPosition = Math.min(...snapPositions);
      if (closestSnap === lowestPosition) {
        runOnJS(onClose)(); // Close the bottom sheet if the lowest snap point is reached
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

        translateY.value = withSpring(screenHeight - screenHeight * closestSnap, {
          damping: 100,
          stiffness: 400,
        });
        const lowestPosition = Math.min(...snapPositions);
        console.log(lowestPosition)
        console.log("closestSnap",closestSnap)
        if (closestSnap === lowestPosition) {
          runOnJS(onClose)(); // Close the bottom sheet if the lowest snap point is reached
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
          <View style={styles.line} />
          <Text style={styles.text}>Comments</Text>
        </View>
        <GestureDetector
          gesture={Gesture.Simultaneous(panScroll, scrollViewGesture)}
        >
          <Animated.ScrollView
            scrollEventThrottle={16}
            bounces={false}
            onScroll={onScroll}
            contentContainerStyle={styles.scrollContent} // Apply the scroll content style here
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
    backgroundColor: 'gray',
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
    backgroundColor: 'red',
    borderRadius: 20,
  },
  scrollContent:{
    paddingBottom: 40
  },
  text:{
    padding:10
  }
});

export default BottomSheet;

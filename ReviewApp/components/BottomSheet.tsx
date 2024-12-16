import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { screenHeight } from '../helpers/dimensions'; // Use screen height
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface BottomSheetProps {
  isOpen: boolean;
  snapPoints: string[]; // Array of snap points (e.g. ['0%', '50%', '100%'])
  backgroundColor: string;
  onClose: () => void;
}

const BottomSheet: FC<BottomSheetProps> = ({ isOpen, snapPoints, backgroundColor, onClose }) => {
  // Convert snap points to percentages and calculate positions
  const snapPositions = snapPoints.map((point) => parseFloat(point.replace('%', '')) / 100);
  const closeHeight = screenHeight; // Bottom sheet closed at the bottom of the screen
  const translateY = useSharedValue(closeHeight); // Start off-screen
  const context = useSharedValue(0);

  React.useEffect(() => {
    // Open to the first snap position (index 0), or use another snap point as needed
    const targetHeight = isOpen
      ? screenHeight - screenHeight * snapPositions[0] 
      : closeHeight;

    translateY.value = withSpring(targetHeight, { damping: 25, stiffness: 200 });
  }, [isOpen, snapPositions]);

  // Pan gesture handler
  const pan = Gesture.Pan()
    .onBegin(() => {
      context.value = translateY.value;
      console.log(translateY.value)
    })
    .onUpdate((event) => {
      const newTranslateY = context.value + event.translationY;
      translateY.value = newTranslateY < 0 ? 0 : newTranslateY; 
    })
    .onEnd(() => {
      // Find the nearest snap point based on the final translation
      const closestSnap = snapPositions.reduce((prev, curr) => {
        const prevDistance = Math.abs(translateY.value - (screenHeight - screenHeight * prev));
        const currDistance = Math.abs(translateY.value - (screenHeight - screenHeight * curr));
        return currDistance < prevDistance ? curr : prev;
      });
      console.log("closestSnap",closestSnap)

      // Snap to the closest snap point
      translateY.value = withSpring(screenHeight - screenHeight * closestSnap, {
        damping: 100,
        stiffness: 400,
      });
      const lowestPosition = Math.min(...snapPositions)

      if (closestSnap === lowestPosition) {
        runOnJS(onClose)();
      }
    });

  // Animated style for applying the translation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, animatedStyle, { backgroundColor }]}>
        <View style={styles.lineContainer}>
          <View style={styles.line}></View>
        </View>
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
    height: 4,
    backgroundColor: 'red',
    borderRadius: 20,
  },
});

export default BottomSheet;

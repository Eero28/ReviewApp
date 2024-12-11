import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { height: screenHeight } = Dimensions.get('window');

interface BottomSheetProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const snapPoints = [0, screenHeight * 0.25, screenHeight * 0.5, screenHeight * 0.75, screenHeight];

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, children }) => {
  const translateY = useSharedValue(screenHeight);
  const initialTranslateY = useSharedValue(screenHeight); // To track the initial position during the drag

  useEffect(() => {
    translateY.value = withTiming(isOpen ? 0 : screenHeight, {
      duration: 300,
    });
  }, [isOpen]);

  const [dragging, setDragging] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      setDragging(true);
      // Capture the initial position when the drag starts
      initialTranslateY.value = translateY.value;
      console.log('Drag started, initial position:', initialTranslateY.value);
    },
    onPanResponderMove: (e, gestureState) => {
      if (dragging) {
        // Calculate the new translateY position based on the initial position and the drag offset
        const newTranslateY = initialTranslateY.value + gestureState.dy;
        translateY.value = Math.max(Math.min(newTranslateY, screenHeight), 0);

        // Log the dragging position
        console.log('Dragging position:', translateY.value);
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      setDragging(false);
      // Find the nearest snap point
      const nearestSnapPoint = snapPoints.reduce((prev, curr) => {
        return Math.abs(curr - translateY.value) < Math.abs(prev - translateY.value) ? curr : prev;
      });

      // Log the snap point
      console.log('Snapping to:', nearestSnapPoint);

      translateY.value = withTiming(nearestSnapPoint, {
        duration: 300,
      });
    },
    onPanResponderTerminate: () => {
      setDragging(false);
      console.log('Drag terminated');
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.bottomSheet, animatedStyle]}>
      <View {...panResponder.panHandlers} style={styles.handle} />
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: screenHeight,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    height: 10,
    width: 60,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default BottomSheet;

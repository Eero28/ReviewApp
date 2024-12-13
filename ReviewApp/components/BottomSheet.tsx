import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PanResponder, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { screenHeight } from '../helpers/dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void | undefined;
  children?: React.ReactNode;
  snapPoints?: number[];
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, children, onClose, snapPoints }) => {
  // include 0 to props = top
  const activeSnapPoints = snapPoints || [0, screenHeight * 0.5, screenHeight];
  const translateY = useSharedValue(screenHeight);
  const initialTranslateY = useSharedValue(screenHeight); // To track the initial position during the drag
  const opacity = useSharedValue(0); // Initial opacity for dimmed background
  useEffect(() => {
    translateY.value = withTiming(isOpen ? 0 : screenHeight, {
      duration: 300,
    });
    opacity.value = withTiming(isOpen ? 0.5 : 0, { duration: 300 });
  }, [isOpen]);

  const [dragging, setDragging] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setDragging(true);
      initialTranslateY.value = translateY.value;
    },
    onPanResponderMove: (e, gestureState) => {
      if (dragging) {
        const newTranslateY = initialTranslateY.value + gestureState.dy;
        translateY.value = Math.max(Math.min(newTranslateY, screenHeight), 0);
      }
    },
    onPanResponderRelease: () => {
      setDragging(false);
      const nearestSnapPoint = activeSnapPoints.reduce((prev, curr) => {
        return Math.abs(curr - translateY.value) < Math.abs(prev - translateY.value) ? curr : prev;
      });
      translateY.value = withTiming(nearestSnapPoint, {
        duration: 300,
      });

      if (nearestSnapPoint === Math.max(...activeSnapPoints)) {
        onClose();
      }
    },
    onPanResponderTerminate: () => {
      setDragging(false);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const dimmedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <>
      <Animated.View
        style={[styles.dimmedBackground, dimmedBackgroundStyle]}
        onTouchEnd={onClose} // Close when tapping outside
      />
      <Animated.View style={[styles.bottomSheet, animatedStyle]}>
        <View {...panResponder.panHandlers} style={styles.handle} />
        <SafeAreaView style={styles.content}>{children}</SafeAreaView>
      </Animated.View>
    </>
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
  dimmedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  handle: {
    height: 15,
    width: 100,
    backgroundColor: '#ccc',
    borderRadius: 7.5,
    alignSelf: 'center',
    marginVertical: 15,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default BottomSheet;

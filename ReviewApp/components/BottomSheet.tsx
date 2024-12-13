import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {screenHeight} from '../helpers/dimensions'
import { SafeAreaView } from 'react-native-safe-area-context';


interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void | undefined;
  children?: React.ReactNode;
  snapPoints?: number[];
}



const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, children, onClose, snapPoints }) => {
  const activeSnapPoints = snapPoints || [0, screenHeight * 0.5, screenHeight];
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
      const nearestSnapPoint = activeSnapPoints.reduce((prev, curr) => {
        return Math.abs(curr - translateY.value) < Math.abs(prev - translateY.value) ? curr : prev;
      });
     
      translateY.value = withTiming(nearestSnapPoint, {
        duration: 300,
      });


      // calc biggest number of array and close if it is the nearestSnapPoint
      if(nearestSnapPoint === Math.max(...activeSnapPoints)){
        onClose()
      }

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
      <SafeAreaView style={styles.content}>{children}</SafeAreaView>
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
    backgroundColor: 'gray',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    backgroundColor:"red"
  },
});

export default BottomSheet;

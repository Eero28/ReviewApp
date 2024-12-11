import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { PanResponder } from 'react-native';

const BottomSheet = ({ isOpen, children, height = 300 }) => {
  const translateY = useSharedValue(isOpen ? 0 : height);
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      if (gestureState.dy < 0) return;
      translateY.value = gestureState.dy;
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dy > 150) {
        translateY.value = withTiming(height, {
          duration: 200,
          easing: Easing.ease,
        });
      } else {
        translateY.value = withTiming(0, {
          duration: 200,
          easing: Easing.ease,
        });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(translateY.value) }],
    };
  });

  return (
    <Animated.View style={[styles.bottomSheet, animatedStyle]}>
      <View
        {...panResponder.panHandlers}
        style={styles.handle}
      />
      <View style={styles.content}>
        {children}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  handle: {
    height: 10,
    width: 100,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
  },
  content: {
    marginTop: 20,
  },
});

export default BottomSheet;

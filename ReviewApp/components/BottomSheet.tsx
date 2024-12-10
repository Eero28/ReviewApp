import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { withSpring, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const BottomSheet = ({ isOpen, children }) => {
  const translateY = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(isOpen ? 0 : 300) }],
    };
  });

  const opacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen ? 1 : 0, { duration: 300 }),
    };
  });

  return (
    <Animated.View style={[styles.bottomSheet, translateY, opacity]}>
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
  content: {
    marginTop: 20,
  },
});

export default BottomSheet;

import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { screenHeight } from '../helpers/dimensions'; // Use screen height
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface BottomSheetProps {
  isOpen: boolean; 
  snapTo?: string;
  backgroundColor: string; 
  onClose: () => void;
}

const BottomSheet: FC<BottomSheetProps> = ({ isOpen, snapTo, backgroundColor, onClose }) => {
  // Set the percentage for the open position. Default to 50% if not provided
  const percentage = snapTo ? parseFloat(snapTo.replace('%', '')) / 100 : 0.5;
  
  // Calculate the open height based on the screen height and snap position
  const openHeight = screenHeight - screenHeight * percentage;
  const closeHeight = screenHeight;
  
  // Shared value for animation (starts with closed position off-screen)
  const translateY = useSharedValue(closeHeight); // Set starting position to be off-screen
  const context = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withSpring(isOpen ? openHeight : closeHeight, { damping: 25, stiffness: 200 });
  }, [isOpen]);

  // Pan gesture handler
  const pan = Gesture.Pan()
    .onBegin(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      if (event.translationY < 0) {
        translateY.value = withSpring(openHeight, {
          damping: 100,
          stiffness: 400,
        });
      } else {
        translateY.value = withSpring(context.value + event.translationY, {
          damping: 100,
          stiffness: 400,
        }); // Update the position during the drag
      }
    })
    .onEnd(() => {
      if (translateY.value > openHeight + 50) {
        translateY.value = withSpring(closeHeight, {
          damping: 100,
          stiffness: 400,
        });
        runOnJS(onClose)(); 
      } else {
        translateY.value = withSpring(openHeight, {
          damping: 100,
          stiffness: 400,
        });
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
      <Animated.View style={[styles.container, animatedStyle, { backgroundColor: backgroundColor }]}>
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

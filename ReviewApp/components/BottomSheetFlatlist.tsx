import React, { FC, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
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
import axios from 'axios';
import { useAuth } from '../ContexApi';
import Icon from '../components/Icon'
// @ts-expect-error: Ignore the issue with the import from @env.
import { API_URL } from '@env';
interface BottomSheetProps {
  isOpen: boolean;
  snapPoints: string[];
  backgroundColor: string;
  handleColor?: string;
  onClose: () => void;
  data: any;
  renderItem: React.FC;
  ListEmptyComponent: React.FC;
  handleTitle?: string;
  ListHeaderComponent?: React.FC;
  ListFooterComponent?: React.FC;
  commentInput?: boolean;
  id_review?: number;
  getReviewComments: () => void;
}

const BottomSheetFlatList: FC<BottomSheetProps> = ({
  isOpen,
  snapPoints,
  backgroundColor,
  handleColor = 'gray',
  onClose,
  data,
  renderItem,
  ListEmptyComponent,
  handleTitle = "",
  ListHeaderComponent,
  commentInput,
  id_review,
  getReviewComments
}) => {

  const { userInfo, handleLogout } = useAuth()

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

  const pan = Gesture.Pan()
    .onBegin(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      const newTranslateY = context.value + event.translationY;

      translateY.value = Math.max(newTranslateY, 0);
    })
    .onEnd(() => {
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

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag: (event) => {
      scrollBegin.value = event.contentOffset.y;
    },
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const panScroll = Gesture.Pan()
    .onBegin(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  //comments

  const [commentText, setCommentText] = useState<string>('');
  const commentInputRef = useRef<TextInput | null>(null);
  const openKeyboard = () => {
    if (commentInput && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const makeComment = async () => {
    try{
      const data = {
        id_user: userInfo?.id_user,
        id_review: id_review,
        text: commentText
  
      }
      await axios.post(`${API_URL}/comments`, data)
      getReviewComments()
      setCommentText('')
    }
    catch(error){
      console.log(error)
      if (error.response && error.response.status === 401) {
        alert("Token expired or invalid. Logging out...");
        await handleLogout();
    }
    }
  }
  useEffect(() => {
    openKeyboard()
  }, [commentInput]);


  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, animatedStyle, { backgroundColor }]}>
        <View style={styles.lineContainer}>
          <View style={[styles.line, { backgroundColor: handleColor }]} />
          <Text style={styles.text}>{handleTitle}</Text>
        </View>
        <GestureDetector
          gesture={Gesture.Simultaneous(panScroll, scrollViewGesture)}
        >
          <Animated.FlatList
            scrollEventThrottle={16}
            bounces={false}
            onScroll={onScroll}
            contentContainerStyle={styles.scrollContent}
            renderItem={renderItem}
            data={data}
            ListEmptyComponent={ListEmptyComponent}
            ListHeaderComponent={ListHeaderComponent}
          >
          </Animated.FlatList>
        </GestureDetector>
        {commentInput && (
          <View style={styles.footerContainer}>
            <TextInput
              ref={commentInputRef}
              value={commentText}
              onChangeText={(val) => setCommentText(val)}
              style={styles.inputField}
              placeholder="Type your comment..."
              placeholderTextColor="whitesmoke"
            />
            {commentText ? <TouchableOpacity style={styles.addCommentButton} onPress={makeComment}>
              <Icon size={35} name='upArrow' />
            </TouchableOpacity>
              :
              ''
            }

          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    paddingBottom: 0,
  },
  text: {
    padding: 10,
    fontFamily: 'poppins',
    color: 'whitesmoke'
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#121314',
  },
  inputField: {
    flex: 1,
    backgroundColor: '#121314',
    color: 'whitesmoke',
    height: 40,
    margin: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  addCommentButton: {
    padding: 10,
    borderRadius: 10,
  }
});

export default BottomSheetFlatList;

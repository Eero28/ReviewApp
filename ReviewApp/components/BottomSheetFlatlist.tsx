import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ListRenderItem,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { screenHeight } from '../helpers/dimensions';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import axios from 'axios';
import { useAuth } from '../providers/ContexApi';
import Icon from './Icon';
import { Comment } from '../interfaces/Comment';
import { API_URL } from '@env';

interface BottomSheetProps {
  isOpen: boolean;
  snapPoints: string[];
  backgroundColor: string;
  handleColor?: string;
  onClose: () => void;
  data: any;
  renderItem: ListRenderItem<Comment>;
  ListEmptyComponent: React.FC;
  handleTitle?: string;
  ListHeaderComponent?: React.FC;
  ListFooterComponent?: React.FC;
  commentInput?: boolean;
  id_review?: number;
  review_name?: string;
  getReviewComments: () => void;
}

function BottomSheetFlatList({
  isOpen,
  snapPoints,
  backgroundColor,
  handleColor = 'gray',
  onClose,
  data,
  renderItem,
  ListEmptyComponent,
  handleTitle = '',
  ListHeaderComponent,
  commentInput,
  id_review,
  review_name,
  getReviewComments,
}: BottomSheetProps) {
  const { userInfo, handleLogout, allReviewsFetch } = useAuth();

  const snapPositions = snapPoints.map((point) => parseFloat(point.replace('%', '')) / 100);
  const closeHeight = screenHeight;
  const translateY = useSharedValue(closeHeight);
  const context = useSharedValue(0);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    const targetHeight = isOpen
      ? screenHeight - screenHeight * snapPositions[0]
      : closeHeight;

    translateY.value = withSpring(targetHeight, { damping: 100, stiffness: 400 });
  }, [isOpen]);

  const panHandle = Gesture.Pan()
    .onBegin(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = Math.min(Math.max(context.value + event.translationY, 0), closeHeight);
    })
    .onEnd(() => {
      // snap to closest snap point
      const closestSnap = snapPositions.reduce((prev, curr) => {
        const prevDistance = Math.abs(translateY.value - (screenHeight - screenHeight * prev));
        const currDistance = Math.abs(translateY.value - (screenHeight - screenHeight * curr));
        return currDistance < prevDistance ? curr : prev;
      });
      const finalPosition = screenHeight - screenHeight * closestSnap;

      translateY.value = withSpring(finalPosition, { damping: 20, stiffness: 150, mass: 1 });
      if (closestSnap === Math.min(...snapPositions)) scheduleOnRN(onClose);
    });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // list part
  const panList = Gesture.Pan()
    .onBegin(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      // Only drag the sheet down if the list is scrolled to top
      if (scrollY.value <= 0 && event.translationY > 0) {
        translateY.value = Math.min(Math.max(context.value + event.translationY, 0), closeHeight);
      }
    })
    .onEnd(() => {
      if (scrollY.value <= 0) {
        // snap to closest snap point
        const closestSnap = snapPositions.reduce((prev, curr) => {
          const prevDistance = Math.abs(translateY.value - (screenHeight - screenHeight * prev));
          const currDistance = Math.abs(translateY.value - (screenHeight - screenHeight * curr));
          return currDistance < prevDistance ? curr : prev;
        });
        const finalPosition = screenHeight - screenHeight * closestSnap;

        translateY.value = withSpring(finalPosition, { damping: 20, stiffness: 150, mass: 1 });
        if (closestSnap === Math.min(...snapPositions)) scheduleOnRN(onClose);
      }
    });

  const scrollViewGesture = Gesture.Native();

  // allow both gestures to work the same time
  const combinedGestures = Gesture.Simultaneous(panList, scrollViewGesture)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const [commentText, setCommentText] = useState('');
  const commentInputRef = useRef<TextInput | null>(null);


  const makeComment = async () => {
    try {
      const data = {
        id_user: userInfo?.id_user,
        id_review,
        text: commentText,
      };
      await axios.post(`${API_URL}/comments`, data);
      getReviewComments();
      allReviewsFetch();
      setCommentText('');
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 401) {
        alert("Token expired or invalid. Logging out...");
        await handleLogout();
      }
    }
  };

  useEffect(() => {
    if (commentInput && commentInputRef.current && isOpen) {
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 100);
    }
  }, [commentInput, isOpen]);


  return (
    <Animated.View style={[styles.container, animatedStyle, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'flex-end' }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 30}
      >
        <GestureDetector gesture={panHandle}>
          <View style={styles.lineContainer}>
            <View style={[styles.line, { backgroundColor: handleColor }]} />
            {handleTitle ? <Text style={styles.text}>{String(handleTitle)}</Text> : null}
          </View>
        </GestureDetector>

        <GestureDetector gesture={combinedGestures}>
          <Animated.FlatList
            scrollEventThrottle={16}
            bounces={false}
            onScroll={onScroll}
            contentContainerStyle={{ paddingBottom: commentInput ? 70 : 10 }}
            renderItem={renderItem}
            data={data}
            ListEmptyComponent={ListEmptyComponent}
            ListHeaderComponent={ListHeaderComponent}
            style={{ flex: 1 }}
          />
        </GestureDetector>

        {commentInput && (
          <View style={styles.footerContainer}>
            <TextInput
              ref={commentInputRef}
              value={commentText}
              onChangeText={setCommentText}
              style={styles.inputField}
              placeholder={`Type your comment for the review...`}
              placeholderTextColor="whitesmoke"
            />
            {commentText && (
              <Pressable style={styles.addCommentButton} onPress={makeComment}>
                <Icon size={35} name="upArrow" />
              </Pressable>
            )}
          </View>
        )}
      </KeyboardAvoidingView>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  text: {
    padding: 10,
    fontFamily: 'poppins',
    color: 'whitesmoke',
  },
  scrollContent: {
    paddingBottom: 0,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
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
  },
});

export default BottomSheetFlatList;

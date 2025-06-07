import React, { FC, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FontAwesome } from '@expo/vector-icons';
import UserComment from '../components/UserComment';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Comment } from '../interfaces/Comment';
import axios from 'axios';
// @ts-expect-error: Ignore the issue with the import from @env.
import { API_URL } from '@env';
import BottomSheetFlatList from '../components/BottomSheetFlatlist';
import { calculateDate } from '../helpers/date';
import EmptyList from '../components/EmptyList';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ReviewItemIf } from '../interfaces/ReviewItemIf';
import { useAuth } from '../ContexApi';
import { toggleLike, getReviewLikes } from '../helpers/services/reviewService';
import AnimatedRecommendations from '../components/AnimatedRecommendations';


type RootStackParamList = {
  ReviewDetails: {
    item: ReviewItemIf;
    showComment?: boolean;
  };
};

const ReviewDetails: FC = () => {
  const { setReviewsUpdated, reviewsUpdated, userInfo } = useAuth();

  // Get params using route
  const route = useRoute<RouteProp<RootStackParamList, 'ReviewDetails'>>();
  const { item, showComment } = route.params;

  const [comments, setComments] = useState<Comment[]>([]);
  const [recommendations, setRecommendations] = useState<[]>()
  const [likesState, setLikesState] = useState<{ user: any; isLiked: boolean }>({
    user: item.likes || [],
    isLiked: false,
  });

  // Bottom Sheet
  const [isOpen, setIsOpen] = useState(false);
  const toggleSheet = () => {
    setIsOpen(!isOpen);
  };

  const getRecommendations = async () => {
  try {
    const response = await axios.get(`${API_URL}/tensorflow/recommendations/${userInfo?.id_user}`);

    // Filter out recommendations with the same id_review as the current item
    const filteredRecommendations = response.data.data.filter(recommendation => {
      return recommendation.review.id_review !== item.id_review;
    });

    setRecommendations(filteredRecommendations);
  } catch (error) {
    console.log(error);
  }
};




  const getReviewComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/comments/review/${item.id_review}`);
      if (response.data && response.data.data) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  useEffect(() => {
    if (userInfo?.id_user) {
      getReviewLikes(userInfo.id_user, item.id_review, setLikesState);
      getRecommendations();
    }

    if (showComment) {
      toggleSheet();
    }

    getReviewComments();
  }, [item.id_review, userInfo?.id_user]);


  const onLikePress = async () => {
    if (!userInfo) return;
    await toggleLike(likesState, userInfo, item.id_review, setLikesState);
    setReviewsUpdated(!reviewsUpdated);
  };

  const hasRecommendations = () => {
    if(!recommendations){
      return
    }
    return recommendations?.length > 0;
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <Text style={styles.title}>{item.reviewname}</Text>
        <Image style={styles.image} source={{ uri: item.imageUrl }} />
        <View style={styles.ratingContainer}>
          <StarRating
            starSize={20}
            rating={Math.round(item.reviewRating)}
            onChange={() => { }}
            color="#0f3c85"
          />
          <Text style={styles.ratingText}>({item.reviewRating})</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{item.reviewDescription}</Text>
          <Text style={styles.text}>Reviewed: {calculateDate(item.createdAt)}</Text>
          <Text style={styles.text}>Reviewed By: {item.user.username}</Text>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity onPress={onLikePress} style={styles.pressable}>
            <FontAwesome
              name={likesState.isLiked ? 'heart' : 'heart-o'}
              size={24}
              color={likesState.isLiked ? 'blue' : 'black'}
            />
            <Text style={styles.text}>{likesState.user.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSheet} style={styles.pressable}>
            <MaterialCommunityIcons name="chat-outline" size={24} color="black" />
            <Text style={styles.text}>{comments.length}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {hasRecommendations() && (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>You might also like:</Text>
            <AnimatedRecommendations recommendations={recommendations || []} />
          </>
        )}
      <BottomSheetFlatList
        renderItem={({ item }) => (
          <UserComment item={item} getReviewComments={getReviewComments} />
        )}
        data={comments}
        ListEmptyComponent={EmptyList}
        onClose={toggleSheet}
        snapPoints={['100%', '30%', '20%']}
        backgroundColor="#121314"
        isOpen={isOpen}
        handleTitle="Comments"
        commentInput
        id_review={item.id_review}
        getReviewComments={getReviewComments}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#CDF2EC',
  },
  cardContainer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0f3c85',
  },
  image: {
    borderRadius: 20,
    width: '100%',
    aspectRatio: 3 / 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:10
  },
  ratingText: {
    paddingLeft: 8,
    fontSize: 16,
    color: '#444',
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    justifyContent: 'center',
  },
  pressable: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#eef2f7',
    gap: 5,
  },
});

export default ReviewDetails;

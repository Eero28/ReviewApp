import React, { FC, useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FontAwesome } from '@expo/vector-icons';
import UserComment from '../components/UserComment';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Comment } from '../interfaces/Comment';
import axios from 'axios';
import { API_URL } from '@env';
import BottomSheetFlatList from '../components/BottomSheetFlatlist';
import { calculateDate } from '../helpers/date';
import EmptyList from '../components/EmptyList';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ReviewItemIf } from '../interfaces/ReviewItemIf';
import { useAuth } from '../ContexApi';
import { toggleLike, getReviewLikes } from '../helpers/services/reviewService';
import AnimatedRecommendations from '../components/AnimatedRecommendations';
import { selectColor } from '../helpers/tastegroup';
import { categories } from '../helpers/categories';
import Icon from '../components/Icon';

type RootStackParamList = {
  ReviewDetails: {
    item: ReviewItemIf;
    showComment?: boolean;
  };
};

const ReviewDetails: FC = () => {
  const { setReviewsUpdated, reviewsUpdated, userInfo } = useAuth();

  const route = useRoute<RouteProp<RootStackParamList, 'ReviewDetails'>>();
  const { item, showComment } = route.params;

  const [comments, setComments] = useState<Comment[]>([]);
  const [recommendations, setRecommendations] = useState<[]>([]);
  const [likesState, setLikesState] = useState<{ user: any; isLiked: boolean }>({
    user: item.likes || [],
    isLiked: false,
  });
  const scrollRef = useRef<ScrollView | null>(null);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };


  const [isOpen, setIsOpen] = useState(false);
  const toggleSheet = () => setIsOpen(!isOpen);

  const getRecommendations = async () => {
    try {
      const response = await axios.get(`${API_URL}/tensorflow/recommendations/${userInfo?.id_user}`);
      const filteredRecommendations = response.data.data.filter(
        (recommendation) => recommendation.review.id_review !== item.id_review
      );
      setRecommendations(filteredRecommendations);
    } catch (error) {
      console.log(error);
    }
  };

  const getReviewComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/comments/review/${item.id_review}`);
      if (response.data?.data) setComments(response.data.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  useEffect(() => {
    if (userInfo?.id_user) {
      getReviewLikes(userInfo.id_user, item.id_review, setLikesState);
      getRecommendations();
    }

    if (showComment) toggleSheet();

    getReviewComments();
  }, [item.id_review, userInfo?.id_user]);

  const onLikePress = async () => {
    if (!userInfo) return;
    await toggleLike(likesState, userInfo, item.id_review, setLikesState);
    setReviewsUpdated(!reviewsUpdated);
  };

  const checkCategoryIcon = (val: string) => {
    const category = categories.find(cat => cat.icon === val);
    if (!category) return null;
    return <Icon size={20} name={category.icon} />;
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.cardContainer}>
          <Text style={styles.title}>{item.reviewname}</Text>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.reviewItemImage}
              source={{ uri: item.imageUrl }}
            />
            <View style={styles.categoryBadge}>
              {checkCategoryIcon(item.category)}
            </View>
          </View>
          <View style={styles.ratingContainer}>
            <StarRating maxStars={5} enableHalfStar starSize={20} rating={item.reviewRating} onChange={() => { }} color="black" />
            <Text style={styles.ratingText}>({item.reviewRating})</Text>
          </View>
          <Text style={styles.aboutTitle}>About the product</Text>
          <Text style={styles.textDescription}>{item.reviewDescription}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.textDescription}>Category: {item.category}</Text>

            <Text style={styles.text}>Reviewed: {calculateDate(item.createdAt)}</Text>
            <View style={styles.reviewerContainer}>
              <Text style={styles.text}>By: {item.user.username}</Text>
              <Image source={{ uri: userInfo?.avatar }} style={styles.profileImage} />
            </View>
          </View>
          <Text style={styles.flavorTitle}>Flavor profile</Text>
          <View style={styles.descriptionBoxesContainer}>
            {item.reviewTaste.map((tasteItem, index) => (
              <View key={index} style={[styles.descriptionBox, { backgroundColor: selectColor(tasteItem) }]}>
                <TouchableOpacity>
                  <Text style={styles.descriptionText}>{tasteItem}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={styles.statsContainer}>
            <TouchableOpacity onPress={onLikePress} style={styles.pressable}>
              <FontAwesome
                name={likesState.isLiked ? 'heart' : 'heart-o'}
                size={28}
                color={likesState.isLiked ? 'blue' : 'black'}
              />
              <Text style={styles.text}>{likesState.user.length}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSheet} style={styles.pressable}>
              <MaterialCommunityIcons name="chat-outline" size={28} color="black" />
              <Text style={styles.text}>{comments.length}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {recommendations && recommendations.length > 0 && (
          <View style={styles.recommendationsContainer}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>You might also like:</Text>
            <AnimatedRecommendations onCardPress={() => scrollToTop()} recommendations={recommendations} />
          </View>
        )}
      </ScrollView>
      <BottomSheetFlatList
        renderItem={({ item }) => (
          <UserComment id_review={route.params.item.id_review} item={item} getReviewComments={getReviewComments} />
        )}
        data={comments}
        ListEmptyComponent={EmptyList}
        onClose={toggleSheet}
        snapPoints={['100%', '80%']}
        backgroundColor="#121314"
        isOpen={isOpen}
        handleTitle="Comments"
        commentInput
        id_review={item.id_review}
        review_name={item.reviewname}
        getReviewComments={getReviewComments}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
  },
  cardContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    elevation: 5,
  },
  reviewerContainer: {
    flexDirection: "row",
    gap: 5
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F3C88',
    marginBottom: 15,
    textAlign: 'center',
  },
  flavorTitle: {
    fontFamily: "poppins",
    marginTop: 12,
    fontWeight: 600,
    fontSize: 15
  },
  imageWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  reviewItemImage: {
    width: '100%',
    height: 340,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  profileImage: {
    width: 25,
    height: 25,
    borderRadius: 14,
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
  },
  textContainer: {
    marginTop: 20,
    backgroundColor: '#F0F4FF',
    padding: 15,
    borderRadius: 16,
  },

  textDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  aboutTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F3C88',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'left',
  },
  text: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 6,
  },
  reviewMeta: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewMetaText: {
    fontSize: 13,
    color: '#7B7B7B',
    fontFamily: 'poppins',
  },
  descriptionBoxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
    marginVertical: 15,
  },
  descriptionBox: {
    width: '28%',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F3C88',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    backgroundColor: '#E3E8EF',
  },
  recommendationsContainer: {
    width: '100%',
    paddingHorizontal: 15,
    marginTop: 10,
  },
});



export default ReviewDetails;

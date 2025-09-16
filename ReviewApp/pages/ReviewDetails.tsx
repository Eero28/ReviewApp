import { FC, useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Comment } from '../interfaces/Comment';
import { useAuth } from '../providers/ContexApi';
import { useTheme } from '../providers/ThemeContext';
import { API_URL } from '@env';
import UserComment from '../components/UserComment';
import BottomSheetFlatList from '../components/BottomSheetFlatlist';
import AnimatedRecommendations from '../components/AnimatedRecommendations';
import BackButton from '../components/BackButton';
import Icon from '../components/Icon';
import EmptyList from '../components/EmptyList';
import { categories } from '../helpers/categories';
import { selectColor } from '../helpers/tastegroup';
import { calculateDate, formatDate } from '../helpers/date';
import { likeReview } from '../helpers/services/reviewService';
import { screenHeight, screenWidth } from '../helpers/dimensions';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../interfaces/navigation';

export interface ReviewDetailsNavigationProp
  extends StackNavigationProp<MainStackParamList, "ReviewDetails"> { }

export interface ReviewDetailsRouteProp
  extends RouteProp<MainStackParamList, "ReviewDetails"> { }

const profileSize = screenWidth * 0.15;

const ReviewDetails: FC = () => {
  const { colors, fonts, paddingSpacing } = useTheme();
  const { setReviewsUpdated, userInfo, userReviews } = useAuth();

  const route = useRoute<ReviewDetailsRouteProp>();
  const navigation = useNavigation<ReviewDetailsNavigationProp>();
  const { item, showComment } = route.params;

  // Pull the latest review from allReviews
  const reviewItem = userReviews.find(r => r.id_review === item.id_review) || item;

  const [comments, setComments] = useState<Comment[]>([]);
  const [recommendations, setRecommendations] = useState<[]>([]);
  const [likesState, setLikesState] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const scrollRef = useRef<ScrollView | null>(null);
  const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: true });
  const toggleSheet = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (showComment) setIsOpen(true);
  }, [showComment]);

  useEffect(() => {
    if (userInfo?.id_user) getRecommendations();
  }, [userInfo?.id_user]);

  useEffect(() => {
    getReviewComments();
  }, [reviewItem.id_review]);

  const getRecommendations = async () => {
    try {
      const response = await axios.get(`${API_URL}/tensorflow/recommendations/${userInfo?.id_user}`);
      const filteredRecommendations = response.data.data.filter(
        (recommendation) => recommendation.review.id_review !== reviewItem.id_review
      );
      setRecommendations(filteredRecommendations);
    } catch (error) {
      console.log(error);
    }
  };

  const getReviewComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/comments/review/${reviewItem.id_review}`);
      if (response.data?.data) setComments(response.data.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleLiking = async () => {
    if (isProcessing || !userInfo) return;
    setIsProcessing(true);
    setLikesState(prev => !prev);
    try {
      if (likesState) {
        await axios.delete(`${API_URL}/likes/unlike/review/${reviewItem.id_review}/user/${userInfo.id_user}`);
      } else {
        await likeReview(reviewItem.id_review, userInfo.id_user);
      }
      setReviewsUpdated(prev => !prev);
    } catch (error) {
      console.error("Error liking/unliking:", error);
      setLikesState(prev => !prev);
    } finally {
      setIsProcessing(false);
    }
  };

  const checkCategoryIcon = (val: string) => {
    const category = categories.find(cat => cat.icon === val);
    return category ? (
      <View style={styles.iconWrapper}>
        <Icon size={38} name={category.icon} />
      </View>
    ) : null;
  };

  const updateReview = () => {
    navigation.navigate("TakeImage", {
      isUpdate: true,
      initialImage: reviewItem.imageUrl,
      initialData: reviewItem,
    });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: paddingSpacing.xxl }}>
        <View style={[styles.cardContainer, { backgroundColor: colors.card.bg }]}>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.reviewItemImage}
              source={{ uri: reviewItem.imageUrl }}
            />
            <View style={styles.overlayContainer}>
              {checkCategoryIcon(reviewItem.category)}
              <Pressable onPress={handleLiking} style={styles.heartButton} disabled={isProcessing}>
                <FontAwesome
                  name={likesState ? 'heart' : 'heart-o'}
                  size={24}
                  color={likesState ? '#ff4757' : '#fff'}
                />
              </Pressable>
            </View>
            <Text style={[styles.title, { color: colors.textColorPrimary, fontFamily: fonts.bold }]}>
              {reviewItem.reviewname}
            </Text>
            <BackButton />
          </View>

          <View style={styles.ratingContainer}>
            <StarRating
              maxStars={5}
              enableHalfStar
              starSize={20}
              rating={reviewItem.reviewRating}
              onChange={() => { }}
              color={colors.card.star}
            />
            <Text style={[styles.ratingText, { color: colors.textColorSecondary }]}>
              ({reviewItem.reviewRating})
            </Text>
          </View>

          <View style={styles.sectionWrapper}>
            <Text style={[styles.sectionTitle, { color: colors.textColorPrimary, fontFamily: fonts.semiBold }]}>
              About the Product
            </Text>
            <Text style={[styles.textDescription, { color: colors.textColorSecondary }]}>
              {reviewItem.reviewDescription}
            </Text>
          </View>

          <View style={styles.sectionWrapper}>
            <Text style={[styles.sectionTitle, { color: colors.textColorPrimary, fontFamily: fonts.semiBold }]}>
              Review Info
            </Text>
            <View style={styles.sectionBoxInfo}>
              <MaterialIcons name="info-outline" size={35} color={colors.textColorSecondary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.text, { color: colors.textColorSecondary }]}>
                  {`Category: ${reviewItem.category}`}
                </Text>
                <Text style={[styles.text, { color: colors.textColorSecondary }]}>
                  {`Price range: ${reviewItem.priceRange} euros`}
                </Text>
                <Text style={[styles.text, { color: colors.textColorSecondary }]}>
                  {`Reviewed: ${calculateDate(reviewItem.createdAt)}`}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionWrapper}>
            <Text style={[styles.sectionTitle, { color: colors.textColorPrimary, fontFamily: fonts.semiBold }]}>
              Reviewer Info
            </Text>
            <View style={styles.reviewerContainer}>
              <Image source={{ uri: reviewItem.user.avatar }} style={styles.profileImage} />
              <View style={styles.reviewerTextContainer}>
                <Text style={[styles.text, { color: colors.textColorSecondary }]}>
                  {`Reviewed by ${reviewItem.user.username}`}
                </Text>
                <Text style={[styles.text, { color: colors.textColorSecondary }]}>
                  {`Member since ${formatDate(reviewItem.user.createdAt)}`}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionWrapper}>
            <Text style={[styles.sectionTitle, { color: colors.textColorPrimary, fontFamily: fonts.semiBold }]}>
              Flavor Profile
            </Text>
            <View style={styles.descriptionBoxesContainer}>
              {reviewItem.reviewTaste.map((tasteItem, index) => {
                const { color, textColor } = selectColor(tasteItem);
                return (
                  <View key={index} style={[styles.descriptionBox, { backgroundColor: color }]}>
                    <Text style={[styles.descriptionText, { color: textColor }]}>{tasteItem}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.statsContainer}>
            <Pressable
              onPress={toggleSheet}
              style={[styles.pressable, { backgroundColor: colors.card.bg, paddingVertical: paddingSpacing.sm, paddingHorizontal: paddingSpacing.md }]}
            >
              <MaterialCommunityIcons name="chat-outline" size={28} color={colors.textColorPrimary} />
              <Text style={[styles.text, { color: colors.textColorSecondary }]}>{comments.length}</Text>
            </Pressable>
            {reviewItem.user.id_user === userInfo?.id_user && (
              <Pressable
                style={[styles.updateButton, { backgroundColor: colors.card.star, padding: paddingSpacing.sm }]}
                onPress={updateReview}
              >
                <Text style={[styles.updateButtonText, { fontFamily: fonts.medium, color: colors.textColorPrimary }]}>Update</Text>
              </Pressable>
            )}
          </View>
        </View>

        {recommendations.length > 0 && (
          <View style={styles.recommendationsContainer}>
            <Text style={[styles.recommendationTitle, { color: colors.textColorPrimary }]}>
              Recommendations for you
            </Text>
            <AnimatedRecommendations onCardPress={scrollToTop} recommendations={recommendations} />
          </View>
        )}
        <View style={{ marginBottom: 5 }}></View>
      </ScrollView>

      <BottomSheetFlatList
        renderItem={({ item }) => (
          <UserComment id_review={reviewItem.id_review} item={item} getReviewComments={getReviewComments} />
        )}
        data={comments}
        ListEmptyComponent={EmptyList}
        onClose={toggleSheet}
        snapPoints={['95%', '75%']}
        backgroundColor={colors.bg}
        isOpen={isOpen}
        handleTitle="Comments"
        commentInput
        id_review={reviewItem.id_review}
        review_name={reviewItem.reviewname}
        getReviewComments={getReviewComments}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cardContainer: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    elevation: 5,
    position: 'relative'
  },
  imageWrapper: {
    alignItems: 'center',
    position: 'relative'
  },
  reviewItemImage: {
    width: '100%',
    height: screenHeight / 2,
    resizeMode: 'cover',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  overlayContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heartButton: {
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  title: {
    fontSize: 24,
    marginVertical: 12,
    textAlign: 'center'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 8
  },
  sectionWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8
  },
  textDescription: {
    fontSize: 16,
    lineHeight: 22
  },
  sectionBoxInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8
  },
  reviewerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8
  },
  reviewerTextContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  profileImage: {
    width: profileSize,
    height: profileSize,
    borderRadius: profileSize / 2
  },
  descriptionBoxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
    marginVertical: 12
  },
  descriptionBox: {
    minWidth: 70,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  descriptionText: {
    fontSize: 14,
    textAlign: 'center'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16
  },
  updateButton: {
    borderRadius: 16,
    width: '25%',
    alignSelf: 'center',
    marginVertical: 12
  },
  updateButtonText: {
    textAlign: 'center',
    color: 'white'
  },
  recommendationsContainer: {
    width: '100%',
    marginVertical: 12,
    textAlign: 'center',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    marginLeft: 20
  },
  text: {
    fontSize: 14,
    marginBottom: 6
  }
});

export default ReviewDetails;

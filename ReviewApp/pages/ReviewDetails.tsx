import { FC, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
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
import { MainStackParamList } from '../interfaces/Navigation';
import { RecommendationSuggestion } from '../interfaces/Recommendation';
import GradientCard from '../components/GradientCard';

export interface ReviewDetailsNavigationProp
  extends StackNavigationProp<MainStackParamList, "ReviewDetails"> { }

export interface ReviewDetailsRouteProp
  extends RouteProp<MainStackParamList, "ReviewDetails"> { }

const profileSize = screenWidth * 0.1;

const ReviewDetails: FC = () => {
  const { colors, fonts, paddingSpacing, fontSizes } = useTheme();
  const { userInfo, allReviewsFetch } = useAuth();

  const route = useRoute<ReviewDetailsRouteProp>();
  const navigation = useNavigation<ReviewDetailsNavigationProp>();
  const { id_review, showComment } = route.params;
  const [reviewItem, setReviewItem] = useState<any | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationSuggestion[]>([]);
  const [likesState, setLikesState] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<ScrollView | null>(null);
  const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: true });
  const toggleSheet = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewItem) {
        setLoading(true);
        try {
          const response = await axios.get(`${API_URL}/review/${id_review}`);
          setReviewItem(response.data.data);
        } catch (error) {
          console.error('Failed to fetch review', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReview();
  }, [id_review]);

  useEffect(() => {
    if (showComment) setIsOpen(true);
  }, [showComment]);

  useEffect(() => {
    if (userInfo?.id_user && reviewItem) getRecommendations();
  }, [userInfo?.id_user, reviewItem]);

  useEffect(() => {
    if (reviewItem) getReviewComments();
  }, [reviewItem]);

  const getRecommendations = async () => {
    try {
      const response = await axios.get(`${API_URL}/tensorflow/recommendations/${userInfo?.id_user}`);
      const filteredRecommendations = response.data.data.filter(
        (rec: RecommendationSuggestion) => rec.review.id_review !== reviewItem.id_review
      );
      setRecommendations(filteredRecommendations);
    } catch (error) {
      console.error(error);
    }
  };

  const getReviewComments = async () => {
    if (!reviewItem) return;
    try {
      const response = await axios.get(`${API_URL}/comments/review/${reviewItem.id_review}`);
      if (response.data?.data) setComments(response.data.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleLiking = async () => {
    if (isProcessing || !userInfo || !reviewItem) return;
    setIsProcessing(true);
    setLikesState(prev => !prev);
    try {
      if (likesState) {
        await axios.delete(`${API_URL}/likes/unlike/review/${reviewItem.id_review}/user/${userInfo.id_user}`);
      } else {
        await likeReview(reviewItem.id_review, userInfo.id_user);
      }
      allReviewsFetch();
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
        {/* @ts-ignore */}
        <Icon size={38} name={category.icon as string} />
      </View>
    ) : null;
  };

  const updateReview = () => {
    navigation.getParent()?.navigate("TakeImage", {
      isUpdate: true,
      initialImage: reviewItem.imageUrl,
      initialData: reviewItem,
    });
  }

  if (loading || !reviewItem) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.textColorSecondary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: paddingSpacing.xxl }}>
        <View style={styles.cardContainer}>
          <View style={styles.imageWrapper}>
            <Image contentFit='cover' style={styles.reviewItemImage} source={{ uri: reviewItem.imageUrl }} />
            <View style={styles.overlayContainer}>
              {checkCategoryIcon(reviewItem.category)}
              <Pressable onPress={handleLiking} style={styles.heartButton} disabled={isProcessing}>
                <FontAwesome name={likesState ? 'heart' : 'heart-o'} size={24} color={likesState ? '#ff4757' : '#fff'} />
              </Pressable>
            </View>
            <BackButton />
          </View>

          <View style={{ padding: 10 }}>
            <GradientCard marginBottom={0}>
              <Text style={{ fontFamily: fonts.bold, fontSize: fontSizes.lg, color: colors.textColorPrimary }}>
                {reviewItem.reviewname}
              </Text>
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={16} color={colors.card.star} />
                <Text style={{ marginLeft: 8, fontFamily: fonts.semiBold, color: colors.textColorSecondary }}>
                  {reviewItem.reviewRating}
                </Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textColorPrimary, fontFamily: fonts.semiBold, fontSize: fontSizes.md }]}>
                About the Product
              </Text>
              <Text style={[styles.textDescription, { color: colors.textColorSecondary }]}>
                {reviewItem.reviewDescription}
              </Text>
            </GradientCard>
          </View>

          <View style={styles.infoContainer}>
            <GradientCard>
              <Text style={[styles.sectionTitle, { color: colors.textColorPrimary, fontFamily: fonts.semiBold, fontSize: fontSizes.md }]}>
                Review Info
              </Text>
              <View style={styles.sectionBoxInfo}>
                <MaterialIcons name="info-outline" size={40} color={colors.textColorSecondary} />
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
            </GradientCard>

            <GradientCard>
              <Text style={[styles.sectionTitle, { color: colors.textColorPrimary, fontFamily: fonts.semiBold, fontSize: fontSizes.md }]}>
                Reviewer Info
              </Text>
              <View style={styles.reviewerContainer}>
                <Image contentFit='cover' source={{ uri: reviewItem.user.avatar }} style={styles.profileImage} />
                <View style={styles.reviewerTextContainer}>
                  <Text style={[styles.text, { color: colors.textColorSecondary }]}>
                    {`Reviewed by ${reviewItem.user.username}`}
                  </Text>
                  <Text style={[styles.text, { color: colors.textColorSecondary }]}>
                    {`Member since ${formatDate(reviewItem.user.createdAt)}`}
                  </Text>
                </View>
              </View>
            </GradientCard>

            <GradientCard>
              <Text style={[styles.sectionTitle, { color: colors.textColorPrimary, fontFamily: fonts.semiBold, fontSize: fontSizes.md }]}>
                Flavor Profile
              </Text>
              <View style={styles.descriptionBoxesContainer}>
                {reviewItem.reviewTaste.map((tasteItem: string, index: number) => {
                  const { color, textColor } = selectColor(tasteItem);
                  return (
                    <View key={index} style={[styles.descriptionBox, { backgroundColor: color }]}>
                      <Text style={[styles.descriptionText, { color: textColor }]}>{tasteItem}</Text>
                    </View>
                  );
                })}
              </View>
            </GradientCard>
          </View>

          <View style={styles.statsContainer}>
            <Pressable onPress={toggleSheet} style={[styles.pressable, { paddingVertical: paddingSpacing.sm, paddingHorizontal: paddingSpacing.md }]}>
              <MaterialCommunityIcons name="chat-outline" size={28} color={colors.textColorPrimary} />
              <Text style={[styles.text, { color: colors.textColorSecondary }]}>{comments.length}</Text>
            </Pressable>
            {reviewItem.user.id_user === userInfo?.id_user && (
              <Pressable style={[styles.updateButton, { backgroundColor: colors.card.star, padding: paddingSpacing.sm }]} onPress={updateReview}>
                <Text style={[styles.updateButtonText, { fontFamily: fonts.medium, color: colors.textColorPrimary }]}>
                  Update
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {recommendations.length > 0 && (
          <View style={{ padding: 10 }}>
            <GradientCard>
              <View style={styles.recommendationsContainer}>
                <Text style={[styles.recommendationTitle, { color: colors.textColorPrimary, fontFamily: fonts.bold, fontSize: fontSizes.lg }]}>
                  Recommendations for you
                </Text>
                <AnimatedRecommendations onCardPress={scrollToTop} recommendations={recommendations} />
              </View>
            </GradientCard>
          </View>
        )}
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
  container: { flex: 1 },
  infoContainer: { padding: 10 },
  cardContainer: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: 20,
    position: 'relative',
  },
  imageWrapper: { alignItems: 'center', position: 'relative' },
  reviewItemImage: {
    width: '100%',
    height: screenHeight / 2,
    resizeMode: 'cover',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  overlayContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  heartButton: {
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  ratingContainer: { flexDirection: 'row', marginVertical: 10 },
  sectionTitle: { marginBottom: 8 },
  textDescription: { fontSize: 16, lineHeight: 22 },
  sectionBoxInfo: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  reviewerContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  reviewerTextContainer: { justifyContent: 'center' },
  profileImage: { width: profileSize, height: profileSize, borderRadius: profileSize / 2 },
  descriptionBoxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 12,
  },
  descriptionBox: {
    minWidth: 70,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  descriptionText: { fontSize: 14, textAlign: 'center' },
  statsContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 12 },
  pressable: { flexDirection: 'row', alignItems: 'center', borderRadius: 16 },
  updateButton: { borderRadius: 16, width: '25%', alignSelf: 'center', marginVertical: 12 },
  updateButtonText: { textAlign: 'center' },
  recommendationsContainer: { width: '100%', textAlign: 'center' },
  recommendationTitle: { marginVertical: 12, marginLeft: 20 },
  text: { fontSize: 14, marginBottom: 6 },
});

export default ReviewDetails;

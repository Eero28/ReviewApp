import { FC } from 'react';
import { SafeAreaView } from 'react-native';
import ReviewFlatlist from '../components/ReviewFlatlist';
import { useAuth } from '../providers/ContexApi'
import FilterButtons from '../components/FilterButtons';



const ReviewsScreen: FC = () => {
  const { userReviews, reviewsWithCategory } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FilterButtons fetchReviewsWithCategory={reviewsWithCategory} />
      <ReviewFlatlist reviews={userReviews} />
    </SafeAreaView>
  );
};



export default ReviewsScreen;

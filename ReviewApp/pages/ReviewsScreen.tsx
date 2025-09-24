import ReviewFlatlist from '../components/ReviewFlatlist';
import { useAuth } from '../providers/ContexApi';
import FilterButtons from '../components/FilterButtons';

const ReviewsScreen = () => {
  const { userReviews, reviewsWithCategory } = useAuth();

  return (
    <>
      <FilterButtons fetchReviewsWithCategory={reviewsWithCategory} />
      <ReviewFlatlist reviews={userReviews} />
    </>
  );
};

export default ReviewsScreen;

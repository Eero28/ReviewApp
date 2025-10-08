import { useState, useEffect } from 'react';
import ReviewFlatlist from '../components/ReviewFlatlist';
import FilterButtons from '../components/FilterButtons';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../providers/ContexApi';

const ReviewsScreen = () => {
  const { fetchReviews, userInfo, userReviews } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userInfo?.id_user) return;

    const fetchData = async () => {
      setLoading(true);
      await fetchReviews("user"); // 'true' = fetch reviews for the current user
      setLoading(false);
    };

    fetchData();
  }, [userInfo]);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <FilterButtons fetchReviewsWithCategory={(category) => fetchReviews("user", category)} />
      <ReviewFlatlist reviews={userReviews} />
    </>
  );
};

export default ReviewsScreen;

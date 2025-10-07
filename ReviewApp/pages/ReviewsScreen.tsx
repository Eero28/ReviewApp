import { useState, useEffect } from 'react';
import ReviewFlatlist from '../components/ReviewFlatlist';
import { useAuth } from '../providers/ContexApi';
import FilterButtons from '../components/FilterButtons';
import LoadingScreen from '../components/LoadingScreen';


const ReviewsScreen = () => {
  const { fetchUserReviews, userInfo, userReviews } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!userInfo?.id_user) return;
    const controller = new AbortController();

    const fetchReviews = async () => {
      setLoading(true);
      await fetchUserReviews()
      setLoading(false);
    };
    fetchReviews();

    return () => controller.abort();
  }, [userInfo]);


  if (loading) return <LoadingScreen />;


  return (
    <>
      <FilterButtons fetchReviewsWithCategory={fetchUserReviews} />
      <ReviewFlatlist reviews={userReviews} />
    </>
  );
};

export default ReviewsScreen;

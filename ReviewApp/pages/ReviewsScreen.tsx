import { useState, useEffect } from 'react';
import ReviewFlatlist from '../components/ReviewFlatlist';
import FilterButtons from '../components/FilterButtons';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../providers/ContexApi';
import { errorHandler } from '../helpers/errors/error';

const ReviewsScreen = () => {
  const { fetchReviews, userInfo, userReviews } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReviews("user", undefined, false, true);
    setRefreshing(false);
  };

  // initial fetch
  useEffect(() => {
    if (!userInfo?.id_user) return;

    const fetchData = async () => {
      setLoading(true);
      await fetchReviews("user", activeCategory, false, true);
      setLoading(false);
    };

    fetchData();
  }, [userInfo?.id_user, activeCategory]);

  // Load more reviews when scrolling
  const onEndReached = async () => {
    try {
      console.log("endd")
      if (loadingMore) return;
      setLoadingMore(true);
      await fetchReviews("user", activeCategory, true, false);
    } catch (error) {
      errorHandler(error)
    } finally {
      setLoadingMore(false);
    }

  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <FilterButtons
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <ReviewFlatlist
        reviews={userReviews ?? []}
        onEndReached={onEndReached}
        disableLongPress={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        type='user'
      />
    </>
  );
};

export default ReviewsScreen;

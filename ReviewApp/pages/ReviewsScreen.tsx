import { useState, useEffect } from 'react';
import ReviewFlatlist from '../components/ReviewFlatlist';
import FilterButtons from '../components/FilterButtons';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../providers/ContexApi';
import { errorHandler } from '../helpers/errors/error';

const ReviewsScreen = () => {
  const { fetchReviews, userInfo, userReviews, userHasMore } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (!userInfo?.id_user) return;
    fetchReviews("user", activeCategory, false, true);
  }, [activeCategory, userInfo?.id_user]);


  const onEndReached = async () => {
    if (loadingMore || !userHasMore) return;

    setLoadingMore(true);
    try {
      await fetchReviews("user", activeCategory, true, false);
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchReviews("user", activeCategory, false, true);
    } finally {
      setRefreshing(false);
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
        loadingMore={loadingMore}
        type="user"
      />
    </>
  );
};

export default ReviewsScreen;

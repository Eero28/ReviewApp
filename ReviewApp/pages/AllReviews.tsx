import { useState, useEffect } from 'react';
import ReviewFlatlist from '../components/ReviewFlatlist';
import FilterButtons from '../components/FilterButtons';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../providers/ContexApi';
import { errorHandler } from '../helpers/errors/error';

const AllReviews = () => {
  const { allReviews, fetchReviews, allHasMore } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchReviews("all", activeCategory, false, true);
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCategory]);

  const onEndReached = async () => {
    if (loadingMore || !allHasMore) return;
    setLoadingMore(true);
    try {
      await fetchReviews("all", activeCategory, true, false);
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoadingMore(false);
    }
  };


  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchReviews("all", activeCategory, false, true);
    } catch (error) {
      errorHandler(error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && (!allReviews || allReviews.length === 0)) return <LoadingScreen />;

  return (
    <>
      <FilterButtons
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <ReviewFlatlist
        reviews={allReviews ?? []}
        onEndReached={onEndReached}
        disableLongPress={true}
        onRefresh={onRefresh}
        refreshing={refreshing}
        loadingMore={loadingMore}
        type='all'
      />
    </>
  );
};

export default AllReviews;

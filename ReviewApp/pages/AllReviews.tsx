import { useState, useEffect } from 'react';
import ReviewFlatlist from '../components/ReviewFlatlist';
import FilterButtons from '../components/FilterButtons';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../providers/ContexApi';

const AllReviews = () => {
  const { allReviews, fetchReviews } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReviews("all", activeCategory, false, true);
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchReviews("all", activeCategory, false, true);
      setLoading(false);
    };

    fetchData();
  }, [activeCategory]);

  const onEndReached = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    await fetchReviews("all", activeCategory, true);
    setLoadingMore(false);
  };

  if (loading) return <LoadingScreen />;

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
        type='all'
      />
    </>
  );
};

export default AllReviews;

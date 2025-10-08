import { useEffect, useState } from 'react';
import ReviewFlatlist from '../components/ReviewFlatlist';
import FilterButtons from '../components/FilterButtons';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../providers/ContexApi';

const AllReviews = () => {
  const { allReviews, fetchReviews, userInfo } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  console.log(allReviews)
  useEffect(() => {
    if (!userInfo?.id_user) return;

    const fetchData = async () => {
      setLoading(true);
      await fetchReviews("all");
      setLoading(false);
    };

    fetchData();
  }, [userInfo]);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <FilterButtons fetchReviewsWithCategory={(category) => fetchReviews("all", category)} />
          <ReviewFlatlist disableLongPress={true} reviews={allReviews ?? []} />
        </>
      )}
    </>
  );
};

export default AllReviews;

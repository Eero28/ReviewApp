import { useEffect, useState } from 'react';
import ReviewFlatlist from '../components/ReviewFlatlist';
import FilterButtons from '../components/FilterButtons';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../providers/ContexApi';

const AllReviews = () => {
  const { allReviews, reviewsWithCategoryAll, userInfo, allReviewsFetch } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userInfo?.id_user) return;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        await allReviewsFetch(controller.signal);
      } catch (err) {
        if ((err as any)?.name !== 'CanceledError') {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [userInfo]);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <FilterButtons fetchReviewsWithCategory={reviewsWithCategoryAll} />
          <ReviewFlatlist disableLongPress={true} reviews={allReviews ?? []} />
        </>
      )}
    </>
  );
};

export default AllReviews;

import ReviewFlatlist from '../components/ReviewFlatlist'
import { useAuth } from '../providers/ContexApi'
import FilterButtons from '../components/FilterButtons'



const AllReviews = () => {
  const { allReviews, reviewsWithCategoryAll } = useAuth()
  return (
    <>
      <FilterButtons fetchReviewsWithCategory={reviewsWithCategoryAll} />
      <ReviewFlatlist disableLongPress={true} reviews={allReviews} />
    </>
  )
}

export default AllReviews


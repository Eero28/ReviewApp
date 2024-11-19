
import React from 'react'
import ReviewFlatlist from '../components/ReviewFlatlist'
import { useAuth } from '../ContexApi'

type Props = {}

const ReviewsScreen = (props: Props) => {
  const {userReviews} = useAuth()
  return (
    <ReviewFlatlist reviews={userReviews}/>
  )
}

export default ReviewsScreen
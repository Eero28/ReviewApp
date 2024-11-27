import React, { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ReviewFlatlist from '../components/ReviewFlatlist';
import { useAuth } from '../ContexApi';
import FilterButtons from '../components/FilterButtons';



const ReviewsScreen: FC = () => {
  const { userReviews,reviewsWithCategory } = useAuth();
  return (
    <>
    <FilterButtons fetchReviewsWithCategory={reviewsWithCategory}/>
    <ReviewFlatlist reviews={userReviews} />
    </>
  );
};



export default ReviewsScreen;

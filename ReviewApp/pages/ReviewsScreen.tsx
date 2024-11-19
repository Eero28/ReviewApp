import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ReviewFlatlist from '../components/ReviewFlatlist';
import { useAuth } from '../ContexApi';
import FilterButtons from '../components/FilterButtons';

type Props = {};

const ReviewsScreen = (props: Props) => {
  const { userReviews,reviewsWithCategory } = useAuth();
  return (
    <>
    <FilterButtons reviewsWithCategory={reviewsWithCategory}/>
    <ReviewFlatlist reviews={userReviews} />
    </>
  );
};



export default ReviewsScreen;

import { StyleSheet, SafeAreaView, FlatList } from 'react-native';
import React, { FC } from 'react';
import { useAuth } from '../ContexApi';
import ReviewItem from '../components/ReviewItem';

const ReviewsScreen: FC = () => {
  const { userReviews } = useAuth();
  return (
    <SafeAreaView>
      <FlatList
        data={userReviews}
        renderItem={({ item }) => (
          <ReviewItem
            item={item}
          />
        )}
        keyExtractor={(item) => item.id_review.toString()}
      />
    </SafeAreaView>
  );
};

export default ReviewsScreen;

const styles = StyleSheet.create({});

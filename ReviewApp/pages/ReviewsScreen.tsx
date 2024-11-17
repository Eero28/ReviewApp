import { StyleSheet, SafeAreaView, FlatList } from 'react-native';
import React, { FC } from 'react';
import { useAuth } from '../ContexApi';
import ReviewItem from '../components/ReviewItem';
import { ReviewItemIf } from '../interfaces/reviewItemIf';

const ReviewsScreen: FC = () => {
  const { userReviews } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={userReviews}
        renderItem={({ item }: { item: ReviewItemIf }) => (
          <ReviewItem
            item={item}
          />
        )}
        keyExtractor={(item) => item.id_review.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default ReviewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
});

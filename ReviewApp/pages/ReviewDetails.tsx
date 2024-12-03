import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import StarRating from 'react-native-star-rating-widget';
import axios from 'axios';
//@ts-ignore
import { API_URL } from '@env';
import { Comment } from '../interfaces/comment';
import CommentsList from '../components/CommentList';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ReviewDetailsProps {
  route: any;
}

const ReviewDetails: FC<ReviewDetailsProps> = ({ route }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { item } = route.params;

  const getReviewComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/comments/review/${item.id_review}`);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  useEffect(() => {
    getReviewComments();
  }, [item.id_review]);

  const renderHeader = () => (
    <View style={styles.cardContainer}>
      <Text style={styles.title}>{item.reviewname}</Text>
      <Image style={styles.image} source={{ uri: item.imageUrl }} />
      <View style={styles.ratingContainer}>
        <StarRating rating={item.reviewRating} onChange={() => {}} color='#0f3c85' />
        <Text style={styles.ratingText}>({item.reviewRating})</Text>
      </View>
      <Text style={styles.text}>{item.reviewDescription}</Text>
      <Text style={styles.text}>Reviewed: {new Date(item.createdAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={comments}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Text style={styles.commentUser}>{item.user.username}:</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id_comment.toString()}
        contentContainerStyle={styles.scrollContainer}
      />
    </SafeAreaView>
  );
};

export default ReviewDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    height: 300,
    width: 300,
    borderRadius: 10,
    marginVertical: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    paddingLeft: 5,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  commentContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  commentUser: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    fontSize: 16,
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
});

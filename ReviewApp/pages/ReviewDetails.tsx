import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import StarRating from 'react-native-star-rating-widget';
import axios from 'axios';
//@ts-ignore
import { API_URL } from '@env';
import { Comment } from '../interfaces/Comment';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserComment from '../components/UserComment';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FontAwesome } from '@expo/vector-icons';
import { ReviewItemIf } from '../interfaces/ReviewItemIf';
interface ReviewDetailsProps {
  route: any;
}

const ReviewDetails: FC<ReviewDetailsProps> = ({ route }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { item } : {item: ReviewItemIf}  = route.params;

  const getReviewComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/comments/review/${item.id_review}`);
      setComments(response.data.data);
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
        <StarRating rating={item.reviewRating} onChange={() => { }} color='#0f3c85' />
        <Text style={styles.ratingText}>({item.reviewRating})</Text>
      </View>
      <Text style={styles.text}>{item.reviewDescription}</Text>
      <Text style={styles.text}>Reviewed: {item.createdAt}</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.text}>
          <MaterialCommunityIcons name="chat-outline" size={24} color="black" />
          {item.comments.length}
        </Text>
        <Text style={styles.text}>
          <FontAwesome
            name={'heart'}
            size={24}
            color={'black'}
          />
          {item.likes.length}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={comments}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <UserComment item={item} />
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
    padding: 20,
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
  dateText: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    padding:20
  }
});

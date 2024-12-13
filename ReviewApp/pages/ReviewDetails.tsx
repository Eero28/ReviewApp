import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import StarRating from 'react-native-star-rating-widget';
import axios from 'axios';
// @ts-ignore
import { API_URL } from '@env';
import { Comment } from '../interfaces/Comment';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FontAwesome } from '@expo/vector-icons';
import { ReviewItemIf } from '../interfaces/ReviewItemIf';
import BottomSheet from '../components/BottomSheet';
import CommentsList from '../components/CommentList';
import { screenHeight } from '../helpers/dimensions';

interface ReviewDetailsProps {
  route: any;
}

const ReviewDetails: FC<ReviewDetailsProps> = ({ route }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { item }: { item: ReviewItemIf } = route.params;
  console.log(item)
  //BottomSheet
  const [isOpen, setIsOpen] = useState(false); 
  const toggleSheet = () => {
    console.log("Toggling sheet");
    setIsOpen(!isOpen);
  };

  const getReviewComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/comments/review/${item.id_review}`);
      setComments(response.data.data); // Update the comments data
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  useEffect(() => {
    getReviewComments(); 
  }, [item.id_review]);

  return (
    <SafeAreaView style={styles.container}>
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
          <Pressable onPress={toggleSheet} style={styles.pressable}>
            <Text style={styles.text}>
              <MaterialCommunityIcons
                name="chat-outline"
                size={24}
                color="black"
              />
              {item.comments.length}
            </Text>
          </Pressable>
          <Pressable style={styles.pressable}>
            <Text style={styles.text}>
              <FontAwesome
                name="heart"
                size={24}
                color="black"
              />
              {item.likes.length}
            </Text>
          </Pressable>
        </View>
      </View>
      {isOpen && <BottomSheet snapPoints={[0, screenHeight * 0.60, screenHeight * 0.50, screenHeight * 0.90]} onClose={toggleSheet} isOpen={isOpen}>
        <CommentsList comments={comments}/>
      </BottomSheet>}
    </SafeAreaView>
    
  );
};

export default ReviewDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8', 
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8, 
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0f3c85', 
  },
  image: {
    height: 250,
    width: '100%',
    borderRadius: 15,
    marginVertical: 10,
    resizeMode: 'cover',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    paddingLeft: 8,
    fontSize: 16,
    color: '#444', 
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
  },
  pressable: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#eef2f7', 
  },
});


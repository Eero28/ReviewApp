import React, { FC, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FontAwesome } from '@expo/vector-icons';
import { screenHeight } from '../helpers/dimensions';
import BottomSheet from '../components/BottomSheet';
import UserComment from '../components/UserComment'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Comment } from '../interfaces/Comment';
import axios from 'axios';
//@ts-ignore
import { API_URL } from '@env';

interface ReviewDetailsProps {
  route: any;
}

const ReviewDetails: FC<ReviewDetailsProps> = ({ route }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { item } = route.params;

  //bottomSheet
  const [isOpen, setIsOpen] = useState(false);
  const toggleSheet = () => {
    setIsOpen(!isOpen);
  }

  const getReviewComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/comments/review/${item.id_review}`);
      if (response.data && response.data.data) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  useEffect(() => {
    getReviewComments();
  }, [item.id_review]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <Text style={styles.title}>{item.reviewname}</Text>
        <Image style={styles.image} source={{ uri: item.imageUrl }} />
        <View style={styles.ratingContainer}>
          <StarRating rating={item.reviewRating} onChange={() => { }} color="#0f3c85" />
          <Text style={styles.ratingText}>({item.reviewRating})</Text>
        </View>
        <Text style={styles.text}>{item.reviewDescription}</Text>
        <Text style={styles.text}>Reviewed: {item.createdAt}</Text>
        <View style={styles.statsContainer}>
          <TouchableOpacity onPress={toggleSheet} style={styles.pressable}>
            <Text style={styles.text}>
              <MaterialCommunityIcons name="chat-outline" size={24} color="black" />
              {item.comments.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pressable}>
            <Text style={styles.text}>
              <FontAwesome name="heart" size={24} color="black" />
              {item.likes.length}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <BottomSheet
      isOpen={isOpen}
      snapPoints={['80%','50%','0%']} 
      backgroundColor="gray"
      onClose={toggleSheet}
      >
      {comments.length > 0 ? (
      comments.map((comment, index) => (
        <UserComment key={index} item={comment} />
      ))
    ) : (
      <Text style={{ textAlign: 'center', marginVertical: 20 }}>
        No comments yet.
      </Text>
    )}
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  cardContainer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
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
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 15,
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

export default ReviewDetails;

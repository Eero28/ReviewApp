import { FC } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RecommendationSuggestion } from '../interfaces/Recommendation';
import { selectColor } from '../helpers/tastegroup';
import StarRating from 'react-native-star-rating-widget';

type Props = {
  item: RecommendationSuggestion;
};

const Recommendation: FC<Props> = ({ item }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.review.imageUrl }} style={styles.image} />
      <View style={styles.imageRating}>
        <StarRating starSize={20} rating={Math.round(item.review.reviewRating)} onChange={() => { }} color="black" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.title}>{item.review.reviewname}</Text>
        <Text style={styles.category}>Category: {item.review.category}</Text>
        <Text style={styles.reviewer}>Reviewed by: {item.review.user.username}</Text>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="chat-outline" size={22} color="#555" />
          <Text style={styles.commentCount}>{item.review.comments?.length ?? 0}</Text>
        </View>
      </View>
      <View style={styles.descriptionBoxesContainer}>
        {item.review.reviewTaste.map((tasteItem, index) => (
          <View key={index} style={[styles.descriptionBox, { backgroundColor: selectColor(tasteItem) }]}>
            <TouchableOpacity>
              <Text style={styles.descriptionText}>{tasteItem}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Recommendation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: 280,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginRight: 12,
    resizeMode: 'cover',
  },
  imageRating: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5
  },
  cardInfo: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    paddingTop: 20,
    paddingBottom: 2,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  category: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
    marginBottom: 2,
  },
  reviewer: {
    fontSize: 15,
    color: '#888',
    marginBottom: 6,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    marginLeft: 6,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  descriptionBoxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 15,
    marginBottom: 10,
    width: '100%',
    gap: 10,
  },
  descriptionBox: {
    width: '30%',
    padding: 12,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f3c85',
    textAlign: 'center',
  },
});

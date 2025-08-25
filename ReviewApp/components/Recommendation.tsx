import { FC } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RecommendationSuggestion } from '../interfaces/Recommendation';
import { selectColor } from '../helpers/tastegroup';
import StarRating from 'react-native-star-rating-widget';
import { screenWidth, screenHeight } from '../helpers/dimensions';

type Props = {
  item: RecommendationSuggestion;
};


const CARD_WIDTH = screenWidth * 0.6;
const CARD_HEIGHT = screenHeight * 0.5;

const Recommendation: FC<Props> = ({ item }) => {
  return (
    <View style={[styles.container, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
      <Image source={{ uri: item.review.imageUrl }} style={[styles.image, { height: CARD_HEIGHT * 0.4 }]} />
      <View style={styles.imageRating}>
        <StarRating
          starSize={20}
          rating={Math.round(item.review.reviewRating)}
          onChange={() => { }}
          color="black"
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.title} numberOfLines={1}>{item.review.reviewname}</Text>
        <Text style={styles.category} numberOfLines={1}>Category: {item.review.category}</Text>
        <Text style={styles.reviewer} numberOfLines={1}>Reviewed by: {item.review.user.username}</Text>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="chat-outline" size={22} color="#555" />
          <Text style={styles.commentCount}>{item.review.comments?.length ?? 0}</Text>
        </View>
      </View>
      <View style={styles.descriptionBoxesContainer}>
        {item.review.reviewTaste.map((tasteItem, index) => (
          <View
            key={index}
            style={[styles.descriptionBox, { backgroundColor: selectColor(tasteItem) }]}
          >
            <TouchableOpacity>
              <Text style={styles.descriptionText} numberOfLines={1}>{tasteItem}</Text>
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
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  imageRating: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
  },
  cardInfo: {
    justifyContent: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
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
    marginTop: 10,
    gap: 10,
  },
  descriptionBox: {
    padding: 8,
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
    fontSize: 10,
    fontWeight: '600',
    color: '#0f3c85',
    textAlign: 'center',
  },
});

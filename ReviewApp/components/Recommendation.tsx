import { FC } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RecommendationSuggestion } from '../interfaces/Recommendation';


type Props = {
  item: RecommendationSuggestion;
};

const Recommendation: FC<Props> = ({ item }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.review.imageUrl }} style={styles.image} />
      <View style={styles.cardInfo}>
        <Text style={styles.title}>{item.review.reviewname}</Text>
        <Text style={styles.category}>Category: {item.review.category}</Text>
        <Text style={styles.reviewer}>Reviewed by: {item.review.user.username}</Text>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="chat-outline" size={18} color="#555" />
          <Text style={styles.commentCount}>{item.review.comments?.length ?? 0}</Text>
        </View>
      </View>
    </View>
  );
};

export default Recommendation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    resizeMode: 'cover',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 2,
  },
  reviewer: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

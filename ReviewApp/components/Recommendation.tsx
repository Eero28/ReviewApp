import React, { FC } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RecommendationSuggestion } from '../interfaces/Recommendation';

type Props = {
  item: RecommendationSuggestion;
};

const Recommendation: FC<Props> = ({ item }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image
        source={{ uri: item.review.imageUrl }}
        style={styles.image}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.title}>{item.review.reviewname}</Text>
        <Text style={styles.description}>Category: {item.review.category}</Text>
        <Text style={styles.description}>
          Reviewed by: {item.review.user.username}
        </Text>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="chat-outline" size={20} color="black" />
          <Text style={styles.commentCount}>{item.review.comments?.length ?? 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Recommendation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 10,
    width: 300,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  commentCount: {
    marginLeft: 6,
    fontSize: 14,
    color: '#000',
  },
});

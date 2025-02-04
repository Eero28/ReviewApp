import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView } from 'react-native';
import { screenWidth } from '../helpers/dimensions';


const CustomCarousel = ({ data }) => {

  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image style={styles.image} source={{ uri: item.review.imageUrl }} />
      <Text style={styles.title}>{item.review.reviewname}</Text>
      <Text style={styles.description}>{item.review.reviewDescription}</Text>
      <Text style={styles.rating}>Rating: {item.review.reviewRating}</Text>
      <Text style={styles.similarity}>Similarity Score: {item.similarityScore.toFixed(2)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={() => {}}
        scrollEventThrottle={16}  
        decelerationRate="fast"   
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,  
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth * 0.85, 
    marginHorizontal: 10, 
    backgroundColor: 'lightgray',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f3c85',
  },
  similarity: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
});

export default CustomCarousel;

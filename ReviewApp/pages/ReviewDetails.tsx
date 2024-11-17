import { StyleSheet, Text, View, Image } from 'react-native';
import React, { FC } from 'react';
import StarRating from 'react-native-star-rating-widget';
import { ReviewItemIf } from '../interfaces/reviewItemIf';

interface ReviewDetailsProps {
  route: {
    params: {
      item: ReviewItemIf;
    };
  };
}
const ReviewDetails: FC<ReviewDetailsProps> = ({ route }) => {
  const { item } = route.params;
  const doNothing = (): void => { };

  const convertDate = (time:string) =>{
    const date = new Date(time);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      timeZone: 'Europe/Helsinki' 
    };
    const finlandDate = date.toLocaleDateString('en-FI', options);
    return finlandDate
  }
  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>{item.reviewname}</Text>
        <Image
          style={styles.image}
          source={{
            uri: item.imageUrl,
          }}
        />
        <StarRating
          rating={item.reviewRating}
          onChange={doNothing}
          color='#0f3c85'
        />
        <Text style={styles.text}>{item.reviewDescription}</Text>
        <Text style={styles.text}>Reviewed: {convertDate(item.createdAt)}</Text>
      </View>
    </View>
  );
};

export default ReviewDetails;

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: 300,
    borderRadius: 10,
    marginVertical: 10,
  },
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
    backgroundColor: "gray",
  },
  cardContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    width: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
});

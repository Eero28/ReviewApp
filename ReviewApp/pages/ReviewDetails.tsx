import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const ReviewDetails = ({ route }) => {
  const { item } = route.params; 

  return (
    <View>
      <Text>Review Details</Text>
      <Text>ID: {item.id_review}</Text>
      <Image
                style={styles.image}
                source={{
                    uri: item.imageUrl,
                }}
            />
    </View>
  );
};

export default ReviewDetails;

const styles = StyleSheet.create({
    image:{
        height: 200,
        width: 200
    }
});

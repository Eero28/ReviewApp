import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type Props = {
    item: any;
};


const ReviewItem = (props: Props) => {
    const navigation = useNavigation<any>();

    const gotoDetails = () => {
        navigation.navigate('ReviewDetails', { item: props.item });
    };

    return (
        <TouchableOpacity onPress={gotoDetails}>
            <Image
                style={styles.image}
                source={{
                    uri: props.item.imageUrl,
                }}
            />
            <Text>{props.item.reviewname}</Text>
        </TouchableOpacity>
    );
};

export default ReviewItem;

const styles = StyleSheet.create({
    image: {
        height: 200,
        width: 200,
    },
});

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { FC } from 'react';

type Props = {
    fetchReviewsWithCategory: (category?: string) => void;
};

const categories = [
    { label: 'Beer', value: 'beer' },
    { label: 'Wine', value: 'wine' },
    { label: 'Softdrink', value: 'softdrink' },
    { label: 'All', value: undefined },
];

const FilterButtons: FC<Props> = ({ fetchReviewsWithCategory }) => {
    return (
        <View style={styles.buttonContainer}>
            {categories.map((category) => (
                <TouchableOpacity
                    key={category.label}
                    onPress={() => fetchReviewsWithCategory(category.value)}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>{category.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default FilterButtons;

const styles = StyleSheet.create({
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#6200EE',
        paddingVertical: 8,
        borderRadius: 5,
        width: '20%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'poppins'
    },
});

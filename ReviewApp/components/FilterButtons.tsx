import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import React, { FC, useState } from 'react';
import Icon from './Icon';

type Props = {
    fetchReviewsWithCategory: (category?: string) => void;
};

const categories = [
    { label: 'All', value: undefined, icon: 'all' },
    { label: 'Beers', value: 'beer', icon: 'beer' },
    { label: 'Wines', value: 'wine', icon: 'wine' },
    { label: 'Softdrinks', value: 'softdrink', icon: 'soda' },
    { label: 'Hot beverages', value: 'hot beverage', icon: 'hotbeverage' },
    { label: 'Cocktails', value: 'cocktail', icon: "cocktail" },
    { label: 'Others', value: 'other', icon: "other" }
];

const FilterButtons: FC<Props> = ({ fetchReviewsWithCategory }) => {
    const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
    
    const handlePress = (categoryValue?: string) => {
        setActiveCategory(categoryValue);
        fetchReviewsWithCategory(categoryValue);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                contentContainerStyle={styles.scrollContainer}
                showsHorizontalScrollIndicator={false}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.label}
                        onPress={() => handlePress(category.value)}
                        style={[
                            styles.button,
                            activeCategory === category.value && styles.activeButton,
                        ]}
                    >
                        <View style={styles.iconContainer}>
                            <Icon
                                //@ts-ignore
                                name={category.icon}
                                size={30}
                                color={activeCategory === category.value ? '#007AFF' : 'black'}
                            />
                            <Text
                                style={[
                                    styles.buttonText,
                                    activeCategory === category.value && styles.selectedButton,
                                ]}
                            >
                                {category.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default FilterButtons;

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    scrollContainer: {
        marginHorizontal: 0,
    },
    button: {
        flex: 1, 
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5, 
        justifyContent: 'center',
        paddingHorizontal: 14, 
    },
    activeButton: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },
    buttonText: {
        color: 'black',
        fontSize: 14,
        fontFamily: 'poppins',
        textAlign: 'center',
    },
    selectedButton: {
        color: '#007AFF',
    },
    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        textAlign: "center"
    }
});

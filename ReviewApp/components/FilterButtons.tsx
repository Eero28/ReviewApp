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
    const { width } = Dimensions.get('window');

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
                            { width: width * 0.2 },
                        ]}
                    >
                        <Icon
                            //@ts-ignore
                            name={category.icon}
                            size={24}
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    button: {
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 10,
        justifyContent: 'center',
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
});

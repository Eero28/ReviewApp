import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { FC, useState } from 'react';
import Icon from './Icon';
import { categories } from '../helpers/categories';

type Props = {
    fetchReviewsWithCategory: (category?: string) => void;
};


const FilterButtons: FC<Props> = ({ fetchReviewsWithCategory }) => {
    const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
    
    const handlePress = (categoryValue?: string) => {
        console.log(categoryValue)
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
                                // @ts-expect-error: Fix later
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
        padding: 5,
        textAlign: "center"
    }
});

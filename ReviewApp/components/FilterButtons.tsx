import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import React, { FC, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

type Props = {
    fetchReviewsWithCategory: (category?: string) => void;
};

// Type for icons, ensuring only valid icon names are passed.
type IoniconName = keyof typeof Ionicons.glyphMap;
type FeatherIconName = keyof typeof Feather.glyphMap;

const categories: { label: string; value?: string; icon: IoniconName | FeatherIconName }[] = [
    { label: 'All', value: undefined, icon: 'filter' },
    { label: 'Beer', value: 'beer', icon: 'beer-outline' },
    { label: 'Wine', value: 'wine', icon: 'wine-outline' },
    { label: 'Softdrink', value: 'softdrink', icon: 'beer-outline' },
    { label: 'Coffee', value: 'coffee', icon: 'coffee' },
];

const FilterButtons: FC<Props> = ({ fetchReviewsWithCategory }) => {
    const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

    const handlePress = (categoryValue?: string) => {
        setActiveCategory(categoryValue);
        fetchReviewsWithCategory(categoryValue);
    };
    const { width } = Dimensions.get('window');

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
                            { width: width * 0.2 }, // Dynamic width based on screen size (20% of screen width)
                        ]}
                    >
                        {category.icon === 'coffee' ? (
                            <Feather
                                color={activeCategory === category.value ? '#007AFF' : 'black'}
                                name="coffee"
                                size={24}
                            />
                        ) : (
                            <Ionicons
                                //@ts-ignore
                                name={category.icon}
                                size={24}
                                color={activeCategory === category.value ? '#007AFF' : 'black'}
                            />
                        )}

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
        paddingVertical: 5,
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
    },
    selectedButton: {
        color: '#007AFF',
    },
});

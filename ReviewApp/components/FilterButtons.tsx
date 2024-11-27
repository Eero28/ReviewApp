import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import React, { FC, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = {
    fetchReviewsWithCategory: (category?: string) => void;
};

const categories = [
    { label: 'All', value: undefined, icon: 'filter' },
    { label: 'Beer', value: 'beer', icon: 'beer-outline' },
    { label: 'Wine', value: 'wine', icon: 'wine-outline' },
    { label: 'Softdrink', value: 'softdrink', icon: 'beer-outline' },
    { label: 'Coffee', value: 'coffee', icon: 'coffee' },
    { label: 'Tea', value: 'tea', icon: 'tea-outline' }
];

const FilterButtons: FC<Props> = ({ fetchReviewsWithCategory }) => {
    const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
    const { width } = Dimensions.get('window');

    const handlePress = (categoryValue?: string) => {
        setActiveCategory(categoryValue);
        fetchReviewsWithCategory(categoryValue);
    };

    const renderIcon = (iconName: string, isActive: boolean) => {
        const iconColor = isActive ? '#007AFF' : 'black';
        if (iconName === 'tea-outline') {
            return <MaterialCommunityIcons name="tea-outline" size={24} color={iconColor} />;
        }
        if (iconName === 'coffee') {
            return <Feather name="coffee" size={24} color={iconColor} />;
        }
        //@ts-ignore
        return <Ionicons name={iconName} size={24} color={iconColor} />;
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
                        {renderIcon(category.icon, activeCategory === category.value)}

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

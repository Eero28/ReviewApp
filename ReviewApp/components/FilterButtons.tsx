import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { FC, useState } from 'react';
import Icon from './Icon';
import { categories } from '../helpers/categories';
import { useTheme } from '../providers/ThemeContext';

type Props = {
    fetchReviewsWithCategory: (category?: string) => void;
};

const FilterButtons: FC<Props> = ({ fetchReviewsWithCategory }) => {
    const { colors, fonts } = useTheme();
    const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

    const handlePress = (categoryValue?: string) => {
        setActiveCategory(categoryValue);
        fetchReviewsWithCategory(categoryValue);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
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
                            activeCategory === category.value && [
                                styles.activeButton,
                                { borderBottomColor: colors.textColorPrimary },
                            ],
                        ]}
                    >
                        <View style={styles.iconContainer}>
                            <Icon
                                name={category.icon}
                                size={30}
                                color={activeCategory === category.value ? colors.textColorPrimary : colors.textColorSecondary || 'black'}
                            />
                            <Text
                                style={[
                                    styles.buttonText,
                                    { color: colors.textColorSecondary || 'black', fontFamily: fonts.regular },
                                    activeCategory === category.value && { color: colors.textColorPrimary },
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
        marginVertical: 0,
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
        borderBottomWidth: 2,
    },
    buttonText: {
        fontSize: 14,
        textAlign: 'center',
    },
    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        textAlign: "center",
    }
});

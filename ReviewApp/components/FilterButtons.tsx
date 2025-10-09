import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { FC } from 'react';
import Icon from './Icon';
import { categories } from '../helpers/categories';
import { useTheme } from '../providers/ThemeContext';
import { useSearch } from '../providers/SearchBarContext';

type Props = {
    activeCategory?: string;
    setActiveCategory: (category?: string) => void;
};

const FilterButtons: FC<Props> = ({ activeCategory, setActiveCategory }) => {
    const { isOpen } = useSearch();
    const { colors, fonts } = useTheme();

    if (isOpen) return null;

    const handlePress = (categoryValue?: string) => {
        setActiveCategory(categoryValue);
        console.log(categoryValue)
    };

    return (
        <View style={{ backgroundColor: colors.bg }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                                // @ts-ignore
                                name={category.icon}
                                size={30}
                                color={
                                    activeCategory === category.value
                                        ? colors.textColorPrimary
                                        : colors.textColorSecondary || 'black'
                                }
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
    button: {
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
});

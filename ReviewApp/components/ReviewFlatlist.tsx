import { FC } from 'react';
import {
    StyleSheet,
    FlatList,
    Text,
    TextInput,
    View,
} from 'react-native';
import ReviewItem from './ReviewItem';
import { ReviewItemIf } from '../interfaces/ReviewItemIf';
import NoReviewsMade from './NoReviewsMade';
import { useTheme } from '../providers/ThemeContext';
import { useSearch } from '../providers/SearchBarContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';


type Props = {
    reviews: ReviewItemIf[];
    disableLongPress?: boolean;
    noReviewsText?: string;
};

const ReviewFlatlist: FC<Props> = ({ reviews, disableLongPress = false, noReviewsText }) => {
    const { colors, fonts } = useTheme();
    const { animatedWidth, isOpen, searchTerm, setSearchTerm } = useSearch();

    const animatedStyle = useAnimatedStyle(() => ({
        width: animatedWidth.value,
    }));


    if (reviews.length <= 0) {
        return <NoReviewsMade noReviewsText={noReviewsText} />;
    }

    const filteredReviews = reviews.filter((review) => {
        const search = searchTerm.toLowerCase().trim();
        const matchesName = review.reviewname?.toLowerCase().trim().includes(search);
        const matchesUser = review.user?.username?.toLowerCase().trim().includes(search);
        const matchesTaste = review.reviewTaste.some(taste =>
            taste.toLowerCase().trim().includes(search)
        );
        return matchesName || matchesUser || matchesTaste;
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
            <View style={styles.searchWrapper}>
                {isOpen && (
                    <Animated.View style={[styles.searchbarContainer, animatedStyle, { backgroundColor: colors.card.bg || '#f2f2f2' }]}>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.form.input || 'lightgray', color: colors.textColorPrimary, fontFamily: fonts.regular }]}
                            onChangeText={val => setSearchTerm(val.toLowerCase())}
                            placeholder="Search"
                            autoFocus={true}
                            placeholderTextColor={colors.textColorSecondary || '#999'}
                        />
                    </Animated.View>
                )}
            </View>

            {filteredReviews.length === 0 && searchTerm ? (
                <Text style={[styles.noResultsText, { color: colors.textColorSecondary, fontFamily: fonts.regular }]}>
                    No search results found
                </Text>
            ) : (
                <FlatList
                    data={filteredReviews}
                    renderItem={({ item }: { item: ReviewItemIf }) => (
                        <View style={styles.itemWrapper}>
                            <ReviewItem disableLongPress={disableLongPress} item={item} />
                        </View>
                    )}
                    keyExtractor={(item) => item.id_review.toString()}
                    contentContainerStyle={styles.listContainer}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

export default ReviewFlatlist;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginVertical: 5,
        paddingHorizontal: 10,
    },
    searchbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        borderRadius: 10,
        height: 50,
        padding: 10,
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemWrapper: {
        width: '48%',
        marginBottom: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    listContainer: {
        paddingBottom: 100,
        paddingHorizontal: 5,
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
});

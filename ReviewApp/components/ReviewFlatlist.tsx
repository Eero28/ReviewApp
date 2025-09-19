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
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

type Props = {
    reviews: ReviewItemIf[];
    disableLongPress?: boolean;
    noReviewsText?: string;
    onUnlike: (id_review: number) => void;
};

const ReviewFlatlist: FC<Props> = ({ reviews, disableLongPress = false, noReviewsText, onUnlike }) => {
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
        <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: colors.bg }]}>
            <View style={styles.searchWrapper}>
                {isOpen && (
                    <Animated.View style={[styles.searchbarContainer, animatedStyle, { backgroundColor: colors.card.bg || '#f2f2f2' }]}>
                        {!searchTerm && (
                            <FontAwesome5
                                style={{ textAling: "center" }}
                                name={"search"}
                                size={20}
                                color={colors.textColorSecondary}
                            />
                        )}
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.form.input, color: colors.textColorPrimary, fontFamily: fonts.regular }]}
                            onChangeText={val => setSearchTerm(val.toLowerCase())}
                            placeholder={"Search reviews, users and tags"}
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
                        <ReviewItem onUnlike={onUnlike} disableLongPress={disableLongPress} item={item} />
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
        justifyContent: 'center',
        marginBottom: 5,
        height: 'auto',

    },
    searchbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: "red",
        height: 60
    },
    input: {
        fontSize: 15,
        borderRadius: 10,
        height: 50,
        padding: 10,
        textAlign: 'center'
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
        paddingHorizontal: 5,
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
});

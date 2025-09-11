import { FC, useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    Text,
    TextInput,
    View,
    Animated,
    TouchableOpacity,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import ReviewItem from './ReviewItem';
import { ReviewItemIf } from '../interfaces/ReviewItemIf';
import NoReviewsMade from './NoReviewsMade';
import { useTheme } from '../providers/ThemeContext';

type Props = {
    reviews: ReviewItemIf[];
    disableLongPress?: boolean;
    noReviewsText?: string;
};

const ReviewFlatlist: FC<Props> = ({ reviews, disableLongPress = false, noReviewsText }) => {
    const { colors, fonts } = useTheme();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [animatedWidth] = useState(new Animated.Value(50));

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

    const toggleSearchBar = () => {
        if (isOpen) {
            Animated.timing(animatedWidth, {
                toValue: 50,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setIsOpen(false));
            setSearchTerm('');
        } else {
            setIsOpen(true);
            Animated.timing(animatedWidth, {
                toValue: 350,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
            <View style={styles.searchWrapper}>
                {isOpen && (
                    <Animated.View style={[styles.searchbarContainer, { width: animatedWidth, backgroundColor: colors.card.bg || '#f2f2f2' }]}>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.card.bgContent || 'lightgray', color: colors.textColorPrimary, fontFamily: fonts.regular }]}
                            onChangeText={val => setSearchTerm(val.toLowerCase())}
                            placeholder="Search"
                            autoFocus={true}
                            placeholderTextColor={colors.textColorSecondary || '#999'}
                        />
                    </Animated.View>
                )}
                <TouchableOpacity onPress={toggleSearchBar} style={styles.iconWrapper}>
                    <AntDesign name={isOpen ? 'close' : 'search1'} size={24} color={colors.textColorPrimary} />
                </TouchableOpacity>
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
        fontSize: 16,
        borderRadius: 10,
        height: 40,
        paddingHorizontal: 10,
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

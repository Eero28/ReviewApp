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

type Props = {
    reviews: ReviewItemIf[];
    disableLongPress?: boolean;
};

const ReviewFlatlist: FC<Props> = ({ reviews, disableLongPress = false }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [animatedWidth] = useState(new Animated.Value(50));

    if (reviews.length <= 0) {
        return <NoReviewsMade />;
    }

    // Filter reviews based on the search term
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
        <SafeAreaView style={styles.container}>
            <View style={styles.searchWrapper}>
                {isOpen && (
                    <Animated.View style={[styles.searchbarContainer, { width: animatedWidth }]}>
                        <TextInput
                            style={styles.input}
                            onChangeText={val => setSearchTerm(val.toLowerCase())}
                            placeholder="Search"
                            autoFocus={true}
                            placeholderTextColor="#999"
                        />
                    </Animated.View>
                )}
                <TouchableOpacity onPress={toggleSearchBar} style={styles.iconWrapper}>
                    <AntDesign name={isOpen ? 'close' : 'search1'} size={24} color="black" />
                </TouchableOpacity>
            </View>
            {filteredReviews.length === 0 && searchTerm ? (
                <Text style={styles.noResultsText}>No search results found</Text>
            ) : (
                <View style={{ flex: 1 }}>
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
                        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    />

                </View>
            )}
        </SafeAreaView>

    );
};

export default ReviewFlatlist;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginVertical: 5,
    },
    searchbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        backgroundColor: 'lightgray',
        borderRadius: 10,
        height: 40,
        paddingHorizontal: 10,
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginLeft: 8,
    },
    itemWrapper: {
        flex: 1,
        padding: 5,
        maxWidth: '50%',

    },
    listContainer: {
        paddingBottom: 100,
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 20,
    },
});

import React, { FC, useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    Text,
    TextInput,
    View,
    Animated,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import ReviewItem from './ReviewItem';
import { ReviewItemIf } from '../interfaces/reviewItemIf';
import NoReviewsMade from './NoReviewsMade';

type Props = {
    reviews: ReviewItemIf[];
    disableLongPress?: boolean;
}

const ReviewFlatlist: FC<Props> = ({reviews, disableLongPress = false}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [animatedWidth] = useState(new Animated.Value(50));
    if (reviews.length <= 0) {
        return (
            <NoReviewsMade/>
        );
    }

    // Filter reviews based on the search term
    const filteredReviews = reviews.filter((val) => {
        const searchResult =
            val.reviewname.toLowerCase().trim().includes(searchTerm.toLowerCase()) ||
            val.user.username.toLowerCase().trim().includes(searchTerm.toLowerCase());

        return searchResult;
    });

    const toggleSearchBar = () => {
        if (isOpen) {
            Animated.timing(animatedWidth, {
                toValue: 50,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setIsOpen(false));
            setSearchTerm("");  
        } else {
            setIsOpen(true);
            Animated.timing(animatedWidth, {
                toValue: 350,  
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <SafeAreaView style={styles.container}>
                {isOpen && (
                    <View style={styles.searchbarWrapper}>
                        <Animated.View style={[styles.searchbarContainer, { width: animatedWidth }]}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(val) => setSearchTerm(val.toLowerCase())}
                                placeholder="Search"
                                autoFocus={true}
                                placeholderTextColor="#999"
                            />
                        </Animated.View>
                        <TouchableOpacity onPress={toggleSearchBar} style={styles.iconWrapper}>
                            <AntDesign name={isOpen ? "close" : "search1"} size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
                {!isOpen && (
                    <TouchableOpacity onPress={toggleSearchBar} style={styles.iconWrapper}>
                        <AntDesign name="search1" size={24} color="black" />
                    </TouchableOpacity>
                )}
                {filteredReviews.length === 0 && !searchTerm ? (
                    <Text style={styles.noResultsText}>No search results found</Text>
                ) : (
                    <FlatList
                        data={filteredReviews.length <= 0 ? reviews : filteredReviews}
                        renderItem={({ item }: { item: ReviewItemIf }) => <ReviewItem disableLongPress={disableLongPress} item={item} />}
                        keyExtractor={(item) => item.id_review.toString()}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default ReviewFlatlist;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    listContainer: {
        paddingBottom: 40,
    },
    searchbarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    searchbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        backgroundColor: "lightgray",
        borderRadius: 10,
        height: 40,
        letterSpacing: 0.2,
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 20,
    },
});

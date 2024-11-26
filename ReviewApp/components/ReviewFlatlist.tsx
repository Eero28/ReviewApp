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
import { useNavigation } from '@react-navigation/native';

type Props = {
    reviews: ReviewItemIf[];
    disableLongPress?: boolean;
}

const ReviewFlatlist: FC<Props> = ({reviews, disableLongPress = false}) => {
    const navigation = useNavigation();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [animatedWidth] = useState(new Animated.Value(50));


    if (reviews.length <= 0) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No reviews yet. Be the first to leave a review!</Text>
            </SafeAreaView>
        );
    }

    // filter also by username
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
            setSearchTerm("")
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
                <View style={styles.searchbarWrapper}>
                    <Animated.View style={[styles.searchbarContainer, { width: animatedWidth }]}>
                        {isOpen && (
                            <TextInput
                                style={styles.input}
                                onChangeText={(val) => setSearchTerm(val.toLowerCase())}
                                placeholder="Search"
                                autoFocus={true}
                                placeholderTextColor="#999"
                            />
                        )}
                    </Animated.View>
                    <TouchableOpacity onPress={toggleSearchBar} style={styles.iconWrapper}>
                        <AntDesign name={isOpen ? "close" : "search1"} size={24} color="black" />
                    </TouchableOpacity>
                </View>
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
        paddingBottom: 16,
    },
    searchbarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    searchbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        paddingHorizontal: 10,
        height: 40,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        backgroundColor: "lightgray",
        borderRadius: 10
    },
    iconWrapper: {
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 20,
    },
});

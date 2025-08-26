import { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ModalDialog from './ModalDialog';
import { useAuth } from '../ContexApi';
import { ReviewItemIf } from '../interfaces/ReviewItemIf';
import { FontAwesome } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import StarRating from 'react-native-star-rating-widget';
import { API_URL } from "@env";
import { categories } from '../helpers/categories';
import Icon from './Icon';
import { getReviewLikes, deleteLike } from '../helpers/services/reviewService';
import { selectColor } from '../helpers/tastegroup';
import { usersLiked } from '../interfaces/UsersLiked';

type Props = {
    item: ReviewItemIf;
    disableLongPress?: boolean;
};

const ReviewItem: FC<Props> = ({ item, disableLongPress = false }) => {
    const { deleteReview, userInfo, setReviewsUpdated, reviewsUpdated } = useAuth();
    const [showDialogModal, setShowDialogModal] = useState(false);
    const [isLongPress, setIsLongPress] = useState(false);
    const [likesState, setLikesState] = useState<usersLiked>({
        user: [],
        isLiked: false,
    });

    const navigation = useNavigation<any>();

    useEffect(() => {
        if (userInfo?.id_user) {
            getReviewLikes(userInfo.id_user, item.id_review, setLikesState);
        }
    }, [item]);

    const likeReview = async () => {
        try {
            if (!userInfo?.id_user) throw new Error("User ID is missing");
            await axios.post(`${API_URL}/likes/like/review/${item.id_review}`, {
                id_user: userInfo.id_user,
            });
            getReviewLikes(userInfo.id_user, item.id_review, setLikesState);
        } catch (error) {
            console.error("Error liking the review:", error);
        }
    };

    const toggleLike = () => {
        if (likesState.isLiked && userInfo) {
            deleteLike(userInfo.id_user, item.id_review, setLikesState);
        } else {
            likeReview();
        }
        setReviewsUpdated(!reviewsUpdated);
    };

    const showModal = () => setShowDialogModal(true);
    const closeModal = () => setShowDialogModal(false);

    const gotoDetails = () => {
        if (!isLongPress) navigation.navigate('ReviewDetails', { item });
    };

    const handleDelete = () => {
        setShowDialogModal(false);
        if (userInfo?.access_token) {
            deleteReview(item.id_review, userInfo.access_token);
        } else {
            Alert.alert("No access to delete!");
        }
    };

    const handlePressIn = () => setIsLongPress(false);
    const handleLongPress = () => {
        if (!disableLongPress) {
            setIsLongPress(true);
            showModal();
        }
    };

    const checkCategoryIcon = (val: string) => {
        const category = categories.find(cat => cat.icon === val);
        if (!category) return null;
        return <Icon size={20} name={category.icon} />;
    };

    const openCommentSection = () => {
        navigation.navigate('ReviewDetails', { item, showComment: true });
    };

    const priceSymbolsMap: { [key: string]: number } = {
        '1-5': 1,
        '10-20': 2,
        '20-50': 3,
        '50-100': 4,
        '+100': 5,
    };

    const renderPriceRange = (range: string) => {
        const count = priceSymbolsMap[range] || 1;
        return <Text style={styles.priceText}>{'€'.repeat(count)}</Text>;
    };

    return (
        <Pressable
            onPress={gotoDetails}
            onLongPress={handleLongPress}
            onPressIn={handlePressIn}
            style={({ pressed }) => [
                styles.reviewItemContainer,
                pressed && { opacity: 0.8 },
            ]}
        >
            <View style={styles.imageWrapper}>
                <Image
                    style={styles.reviewItemImage}
                    source={{ uri: item.imageUrl }}
                />
                <View style={styles.categoryBadge}>
                    {checkCategoryIcon(item.category)}
                </View>
            </View>

            <View style={styles.reviewItemInfo}>
                <Text style={styles.reviewItemTitle}>{item.reviewname}</Text>
                <StarRating
                    enableHalfStar
                    starSize={20}
                    rating={item.reviewRating}
                    onChange={() => { }}
                    color="black"
                />
                <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.reviewItemDescription}
                >
                    Reviewed by: {item.user.username}
                </Text>
                <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>{renderPriceRange(item.priceRange)}</Text>
                </View>
            </View>

            <View style={{ flexGrow: 1 }} />

            <View style={styles.reviewItemTagsContainer}>
                {item.reviewTaste.map((tasteItem, index) => (
                    <View
                        key={index}
                        style={[styles.reviewItemTagBox, { backgroundColor: selectColor(tasteItem) }]}
                    >
                        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}>
                            <Text style={styles.reviewItemTagText}>{tasteItem}</Text>
                        </Pressable>
                    </View>
                ))}
                <View style={{ flexGrow: 1 }} />
            </View>


            <View style={styles.reviewItemIconsContainer}>
                <Pressable onPress={toggleLike} style={styles.reviewItemIconWrapper}>
                    <FontAwesome
                        name={likesState.isLiked ? 'heart' : 'heart-o'}
                        size={24}
                        color={likesState.isLiked ? 'blue' : '#666'}
                    />
                    <Text style={styles.reviewItemIconCount}>{likesState.user.length}</Text>
                </Pressable>

                <Pressable onPress={openCommentSection} style={styles.reviewItemIconWrapper}>
                    <MaterialCommunityIcons name="chat-outline" size={24} color="black" />
                    <Text style={styles.reviewItemIconCount}>{item.comments?.length ?? 0}</Text>
                </Pressable>
            </View>

            <ModalDialog
                dialogTitle={`Delete "${item.reviewname}"?`}
                visible={showDialogModal}
                onCancel={closeModal}
                onDelete={handleDelete}
            />
        </Pressable>
    );
};

export default ReviewItem;

const styles = StyleSheet.create({
    reviewItemContainer: {
        alignItems: 'center',
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#ffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        elevation: 3,
        minHeight: 400,
        borderWidth: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderColor: "white",
        justifyContent: "flex-start"
    },
    imageWrapper: {
        position: 'relative',
    },
    reviewItemImage: {
        height: 140,
        width: 140,
        borderRadius: 12,
        resizeMode: "cover",
    },
    categoryBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 12,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    priceBadge: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 16,
        backgroundColor: 'whitesmoke',
        marginTop: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },

    priceText: {
        color: '#333',
        fontWeight: '700',
        fontSize: 12,
        fontFamily: 'poppins',
    },
    reviewItemInfo: {
        padding: 10,
    },
    reviewItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        fontFamily: 'poppins',
        textAlign: 'center',
    },
    reviewItemDescription: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'poppins',
        marginTop: 5,
    },
    reviewItemTagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        marginVertical: 8,
        gap: 6,
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        minHeight: 90,
    },
    reviewItemTagBox: {
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginBottom: 8,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
        flexShrink: 1,
    },
    reviewItemTagText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#0f3c85",
        textAlign: "center",
        fontFamily: 'poppins',
    },
    reviewItemIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10
    },
    reviewItemIconWrapper: {
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
    },
    reviewItemIconCount: {
        marginLeft: 4,
        fontSize: 16,
        color: "#000",
        fontFamily: 'poppins',
    },
});

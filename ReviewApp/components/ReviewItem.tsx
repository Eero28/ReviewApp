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
import { errorHandler } from '../helpers/errors/error';
import { screenHeight } from '../helpers/dimensions';

type Props = {
    item: ReviewItemIf;
    disableLongPress?: boolean;
};

const ReviewItem: FC<Props> = ({ item, disableLongPress = false }) => {
    const { deleteReview, userInfo, setReviewsUpdated, reviewsUpdated, handleLogout } = useAuth();
    const [showDialogModal, setShowDialogModal] = useState(false);
    const [isLongPress, setIsLongPress] = useState(false);
    const [likesState, setLikesState] = useState<usersLiked>({ user: [], isLiked: false });

    const navigation = useNavigation<any>();

    useEffect(() => {
        if (userInfo?.id_user) {
            getReviewLikes(userInfo.id_user, item.id_review, setLikesState);
        }
    }, [item]);

    const likeReview = async () => {
        try {
            if (!userInfo?.id_user) {
                throw new Error("User ID is missing");
            }

            await axios.post(`${API_URL}/likes/like/review/${item.id_review}`, { id_user: userInfo.id_user });
            getReviewLikes(userInfo.id_user, item.id_review, setLikesState);
            setReviewsUpdated(!reviewsUpdated)
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

    const gotoDetails = () => {
        if (!isLongPress) {
            navigation.navigate('ReviewDetails', { item });
        }
    };

    const showModal = () => {
        setShowDialogModal(true);
    };

    const closeModal = () => {
        setShowDialogModal(false);
    };

    const handleDelete = async () => {
        setShowDialogModal(false);

        if (!userInfo?.access_token) {
            Alert.alert("No access to delete!");
            handleLogout();
            return;
        }

        try {
            await deleteReview(item.id_review, userInfo.access_token);
        } catch (error: any) {
            errorHandler(error, handleLogout);
        }
    };

    const handlePressIn = () => {
        setIsLongPress(false);
    };

    const handleLongPress = () => {
        if (!disableLongPress) {
            setIsLongPress(true);
            showModal();
        }
    };

    const checkCategoryIcon = (val: string) => {
        const category = categories.find(cat => cat.icon === val);
        if (!category) {
            return null;
        }
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
            style={styles.reviewItemContainer}
        >
            <View style={styles.imageWrapper}>
                <Image style={styles.reviewItemImage} source={{ uri: item.imageUrl }} />
                <View style={styles.categoryBadge}>{checkCategoryIcon(item.category)}</View>
            </View>

            <View style={styles.reviewItemInfoWrapper}>
                <Text numberOfLines={2} style={styles.reviewItemTitle}>{item.reviewname}</Text>
                <StarRating enableHalfStar starSize={20} rating={item.reviewRating} onChange={() => { }} color="black" />
                <Text numberOfLines={1} style={styles.text}>Reviewed by: {item.user.username}</Text>
                <View style={styles.priceBadge}>{renderPriceRange(item.priceRange)}</View>

                <View style={styles.reviewItemTagsContainer}>
                    {item.reviewTaste.slice(0, 3).map((tasteItem, index) => (
                        <View key={index} style={[styles.reviewItemTagBox, { backgroundColor: selectColor(tasteItem) }]}>
                            <Text style={styles.reviewItemTagText}>{tasteItem}</Text>
                        </View>
                    ))}
                    {item.reviewTaste.length > 3 && (
                        <View style={[styles.reviewItemTagBox, { backgroundColor: '#ccc' }]}>
                            <Text style={styles.reviewItemTagText}>+{item.reviewTaste.length - 3}</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.tagsSeparator} />

            <View style={styles.reviewItemIconsContainer}>
                <Pressable onPress={toggleLike} style={styles.reviewItemIconWrapper}>
                    <FontAwesome name={likesState.isLiked ? 'heart' : 'heart-o'} size={24} color={likesState.isLiked ? '#ff4757' : '#666'} />
                    <Text style={styles.reviewItemIconCount}>{likesState.user.length}</Text>
                </Pressable>

                <Pressable onPress={openCommentSection} style={styles.reviewItemIconWrapper}>
                    <MaterialCommunityIcons name="chat-outline" size={24} color="black" />
                    <Text style={styles.reviewItemIconCount}>{item.comments?.length ?? 0}</Text>
                </Pressable>
            </View>

            <ModalDialog
                dialogTitle={`Delete "${item.reviewname}"?`}
                showDescription
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
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        elevation: 3,
        padding: 8,
        minHeight: 450,
        width: '100%',
    },
    imageWrapper: {
        position: 'relative',
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
    },
    reviewItemImage: {
        width: '100%',
        height: screenHeight * 0.2,
        borderRadius: 12,
        resizeMode: 'cover',
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
    reviewItemInfoWrapper: {
        flex: 1,
        width: '100%',
        paddingVertical: 8,
    },
    reviewItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    text: {
        fontSize: 14,
        color: '#4A4A4A',
        marginBottom: 6,
    },
    priceBadge: {
        alignSelf: 'flex-start',
        padding: 5,
        marginBottom: 5,
        borderRadius: 16,
        backgroundColor: 'whitesmoke',

    },
    priceText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#333',
    },
    reviewItemTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 6,
        minHeight: 40,
        marginBottom: 6,
    },
    reviewItemTagBox: {
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginBottom: 6,
    },
    reviewItemTagText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#0f3c85',
        textAlign: 'center',
    },
    tagsSeparator: {
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        width: '100%',
        marginTop: 6,
    },
    reviewItemIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: 8,
    },
    reviewItemIconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    reviewItemIconCount: {
        marginLeft: 4,
        fontSize: 16,
        color: '#000',
    },
});

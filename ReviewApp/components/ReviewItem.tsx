import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
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
            deleteLike(userInfo?.id_user, item.id_review, setLikesState);
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
        // @ts-expect-error
        return <Icon size={20} name={category.icon} />;
    };

    const openCommentSection = () => {
        navigation.navigate('ReviewDetails', { item, showComment: true });
    };

    return (
        <TouchableOpacity
            onLongPress={handleLongPress}
            onPressIn={handlePressIn}
            onPress={gotoDetails}
            style={styles.reviewItemContainer}
        >
            <Image
                style={styles.reviewItemImage}
                source={{ uri: item.imageUrl }}
            />
            <View style={styles.reviewItemInfo}>
                <Text style={styles.reviewItemTitle}>{item.reviewname}</Text>
                <StarRating
                    starSize={20}
                    rating={Math.round(item.reviewRating)}
                    onChange={() => { }}
                    color="black"
                />
                <Text style={styles.reviewItemDescription}>Category: {checkCategoryIcon(item.category)}</Text>
                <Text
                    ellipsizeMode='tail'
                    numberOfLines={1}
                    style={styles.reviewItemDescription}
                >
                    Reviewed by: {item.user.username}
                </Text>
            </View>

            <View style={styles.reviewItemTagsContainer}>
                {item.reviewTaste.map((tasteItem, index) => (
                    <View
                        key={index}
                        style={[styles.reviewItemTagBox, { backgroundColor: selectColor(tasteItem) }]}
                    >
                        <TouchableOpacity>
                            <Text style={styles.reviewItemTagText}>{tasteItem}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style={styles.reviewItemIconsContainer}>
                <TouchableOpacity onPress={toggleLike} style={styles.reviewItemIconWrapper}>
                    <FontAwesome
                        name={likesState.isLiked ? 'heart' : 'heart-o'}
                        size={24}
                        color={likesState.isLiked ? 'blue' : '#666'}
                    />
                    <Text style={styles.reviewItemIconCount}>{likesState.user.length}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={openCommentSection} style={styles.reviewItemIconWrapper}>
                    <MaterialCommunityIcons name="chat-outline" size={24} color="black" />
                    <Text style={styles.reviewItemIconCount}>{item.comments?.length ?? 0}</Text>
                </TouchableOpacity>
            </View>

            <ModalDialog
                dialogTitle={`Delete "${item.reviewname}"?`}
                visible={showDialogModal}
                onCancel={closeModal}
                onDelete={handleDelete}
            />
        </TouchableOpacity>
    );
};

export default ReviewItem;

const styles = StyleSheet.create({
    reviewItemContainer: {
        width: "100%",
        alignItems: 'center',
        padding: 10,
        marginVertical: 8,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        elevation: 3,
    },
    reviewItemImage: {
        height: 140,
        width: 140,
        borderRadius: 12,
        resizeMode: "cover",
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
    },
    reviewItemTagBox: {
        minWidth: "42%",
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginBottom: 8,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
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

import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import ModalDialog from './ModalDialog';
import { useAuth } from '../ContexApi';
import { UserInfo } from '../interfaces/UserInfo';
import { ReviewItemIf } from '../interfaces/ReviewItemIf';
import { FontAwesome } from '@expo/vector-icons';
import { usersLiked } from '../interfaces/UsersLiked';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import StarRating from 'react-native-star-rating-widget';
// @ts-expect-error: Ignore the issue with the import from @env.
import { API_URL } from "@env";
import { categories } from '../helpers/categories';
import Icon from './Icon';
import { getReviewLikes, deleteLike } from '../helpers/services/reviewService';

type Props = {
    item: ReviewItemIf;
    disableLongPress?: boolean;
};

const ReviewItem: FC<Props> = ({ item, disableLongPress = false }) => {
    const { deleteReview, userInfo, setReviewsUpdated, reviewsUpdated } = useAuth();
    const [showDialogModal, setShowDialogModal] = useState<boolean>(false);
    const [isLongPress, setIsLongPress] = useState<boolean>(false);
    const [likesState, setLikesState] = useState<usersLiked>({
        user: [],
        isLiked: false,
    });


    const likeReview = async () => {
        try {
            if (!userInfo?.id_user) {
                throw new Error("User ID is missing");
            }

            await axios.post(`${API_URL}/likes/like/review/${item.id_review}`, {
                id_user: userInfo.id_user,
            });

            getReviewLikes(userInfo.id_user, item.id_review, setLikesState);
        } catch (error) {
            console.error("Error liking the review:", error);
        }
    };


    

    useEffect(() => {
        if (userInfo?.id_user) {
            getReviewLikes(userInfo.id_user, item.id_review, setLikesState);
        }

    }, [item]);

    const navigation = useNavigation<any>();

    const showModal = () => {
        setShowDialogModal(true);
    };

    const closeModal = () => {
        setShowDialogModal(false);
    };

    const gotoDetails = () => {
        if (!isLongPress) {
            navigation.navigate('ReviewDetails', { item: item });
        }
    };

    const handleDelete = () => {
        setShowDialogModal(false);
        if (userInfo && userInfo.access_token) {
            deleteReview(item.id_review, userInfo?.access_token);
        } else {
            Alert.alert("No access to delete!");
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

    const toggleLike = () => {
        if (likesState.isLiked && userInfo) {
            deleteLike(userInfo?.id_user,item.id_review,setLikesState);
        } else {
            likeReview();
        }
        setReviewsUpdated(!reviewsUpdated);
    };

    const checkValue = (val: string) => {
        const category = categories.find(item => item.icon === val);
        if (!category) {
            return null;
        }
        // @ts-expect-error: fix later
        return <Icon size={20} name={category.icon} />;
    };

    const commentSection = () => {
        navigation.navigate('ReviewDetails', { item: item, showComment: true });
    }

    return (
        <TouchableOpacity
            onLongPress={handleLongPress}
            onPressIn={handlePressIn}
            onPress={gotoDetails}
            style={styles.container}
        >
            <Image
                style={styles.image}
                source={{
                    uri: item.imageUrl,
                }}
            />
            <View style={styles.cardInfo}>
                <Text style={styles.title}>{item.reviewname}</Text>
                <StarRating
                    starSize={20}
                    rating={Math.round(item.reviewRating)}
                    onChange={() => { }}
                    color="#0f3c85"
                />
                <Text style={styles.description}>Category: {checkValue(item.category)}</Text>
                <Text ellipsizeMode='tail' numberOfLines={1} style={styles.description}>Reviewed by: {item.user.username}</Text>
            </View>

            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={toggleLike} style={styles.iconWrapper}>
                    <FontAwesome
                        name={likesState.isLiked ? 'heart' : 'heart-o'}
                        size={24}
                        color={likesState.isLiked ? 'blue' : '#666'}
                    />
                    <Text style={styles.commentCount}>{likesState.user.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => commentSection()} style={styles.iconWrapper}>
                    <MaterialCommunityIcons name="chat-outline" size={24} color="black" />
                    <Text style={styles.commentCount}>{item.comments?.length ?? 0}</Text>
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
    container: {
        alignItems: 'center',
        padding: 10,
        marginVertical: 8,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        elevation: 3,
    },
    cardInfo: {
        padding: 10,
    },
    image: {
        height: 140,
        width: 140,
        borderRadius: 12,
        objectFit: "cover",
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        fontFamily: 'poppins',
        textAlign: 'center'
    },
    description: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'poppins',
        marginTop: 5
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    iconWrapper: {
        flexDirection: "row",
        alignItems: "center",
        padding: 5
    },
    commentCount: {
        marginLeft: 4,
        fontSize: 16,
        color: "#000",
    },
    iconContainerText: {
        paddingLeft: 5,
        fontFamily: 'poppins'
    }
});

import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import ModalDialog from './ModalDialog';
import { useAuth } from '../ContexApi';
import { UserInfo } from '../interfaces/UserInfo';
import { ReviewItemIf } from '../interfaces/ReviewItemIf';
import { FontAwesome } from '@expo/vector-icons';
import { usersLiked } from '../interfaces/UsersLiked';
import axios from 'axios';
//@ts-ignore
import { API_URL } from "@env";

type Props = {
    item: ReviewItemIf;
    disableLongPress?: boolean;
};

const ReviewItem: FC<Props> = ({ item, disableLongPress = false }) => {
    const { deleteReview, userInfo } = useAuth();
    const [showDialogModal, setShowDialogModal] = useState<boolean>(false);
    const [isLongPress, setIsLongPress] = useState<boolean>(false);
    const [likesState, setLikesState] = useState<usersLiked>({
        user: [],
        isLiked: false,
    });

    const getReviewLikes = async () => {
        try {
            const response = await axios.get(`${API_URL}/likes/users/review/${item.id_review}`);
            const usersWhoLiked = response.data;
            const isLikedByUser = usersWhoLiked.some((like: UserInfo) => like.id_user === userInfo?.id_user);

            setLikesState({
                user: usersWhoLiked,
                isLiked: isLikedByUser,
            });
        } catch (error) {
            console.error('Error fetching review likes:', error);
        }
    };

    const likeReview = async () => {
        try {
            await axios.post(`${API_URL}/likes/like/review/${item.id_review}`, { id_user: userInfo?.id_user });

            getReviewLikes();
        } catch (error) {
            console.error('Error liking the review:', error);
        }
    };

    const deleteLike = async () => {
        try {
            await axios.delete(`${API_URL}/likes/unlike/review/${item.id_review}/user/${userInfo?.id_user}`);

            getReviewLikes();
        } catch (error) {
            console.error('Error unliking the review:', error);
        }
    };

    useEffect(() => {
        getReviewLikes();
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
        if (likesState.isLiked) {
            deleteLike();
        } else {
            likeReview();
        }
    };

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
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.reviewname}</Text>
                <Text style={styles.description}>{item.category}</Text>
                <Text style={styles.description}>{item.id_review}</Text>
                <Text style={styles.description}>Reviewed by: {item.user.username}</Text>
            </View>
            {disableLongPress && (
                <TouchableOpacity onPress={toggleLike} style={styles.iconContainer}>
                    <FontAwesome
                        name={likesState.isLiked ? 'heart' : 'heart-o'}
                        size={24}
                        color={likesState.isLiked ? 'blue' : '#666'}
                    />
                    <Text style={styles.iconContainerText}>{likesState.user.length}</Text>
                </TouchableOpacity>
            )}

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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        elevation: 3,
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        fontFamily: 'poppins'
    },
    description: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'poppins'
    },
    iconContainer: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
    },
    iconContainerText: {
        paddingLeft: 5,
        fontFamily: 'poppins'
    }
});

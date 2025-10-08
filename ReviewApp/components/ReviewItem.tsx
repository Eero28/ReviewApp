import { FC, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ModalDialog from './ModalDialog';
import { useAuth } from '../providers/ContexApi';
import { ReviewItemIf } from '../interfaces/reviewItemIf';
import { FontAwesome } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { selectColor } from '../helpers/tastegroup';
import { errorHandler } from '../helpers/errors/error';
import { categories } from '../helpers/categories';
import { likeReview } from '../helpers/services/reviewService';
import { useTheme } from '../providers/ThemeContext';
import Icon from './Icon';
import axios from 'axios';
import { API_URL } from '@env';
import { screenWidth } from '../helpers/dimensions';
import { Image } from 'expo-image';
import { transformCloudinaryImageSize } from '../helpers/cloudinary';

type Props = {
    item: ReviewItemIf;
    disableLongPress?: boolean;
};

const ReviewItem: FC<Props> = ({ item, disableLongPress = false }) => {
    const { colors, fonts, fontSizes } = useTheme();
    const { deleteReview, userInfo, handleLogout, fetchReviews } = useAuth();
    const navigation = useNavigation<any>();

    const [showDialogModal, setShowDialogModal] = useState<boolean>(false);
    const [likesState, setLikesState] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [imageLoading, setImageLoading] = useState<boolean>(!!item.imagePublicId);

    useEffect(() => {
        if (userInfo && item.likes) {
            const liked = item.likes.some(like => like.user.id_user === userInfo.id_user);
            setLikesState(liked);
        }
    }, [item.likes, userInfo]);

    const handleLiking = async () => {
        if (isProcessing || !userInfo) return;
        setIsProcessing(true);

        let isCancelled = false;

        try {
            if (likesState) {
                await axios.delete(`${API_URL}/likes/unlike/review/${item.id_review}/user/${userInfo.id_user}`);
                if (!isCancelled) setLikesState(false);
            } else {
                await likeReview(item.id_review, userInfo.id_user);
                if (!isCancelled) setLikesState(true);
            }

            if (!isCancelled) {
                await fetchReviews("all");
            }
        } catch (error) {
            console.error("Error liking/unliking:", error);
        } finally {
            if (!isCancelled) setIsProcessing(false);
        }

        return () => { isCancelled = true };
    };


    const gotoDetails = () => navigation.navigate('ReviewDetails', { id_review: item.id_review });
    const openCommentSection = () => navigation.navigate('ReviewDetails', { id_review: item.id_review, showComment: true });

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

    const checkCategoryIcon = (val: string) => {
        const category = categories.find(cat => cat.icon === val);
        {/* @ts-ignore */ }
        return category ? <Icon size={20} name={category.icon} /> : null;
    };

    const priceSymbolsMap: { [key: string]: number } = {
        '1-5': 1, '10-20': 2, '20-50': 3, '50-100': 4, '+100': 5,
    };

    const renderPriceRange = (range: string) => (
        <Text style={[{ color: colors.textColorPrimary, fontFamily: fonts.medium, fontSize: fontSizes.sm }]}>
            {'€'.repeat(priceSymbolsMap[range] || 1)}
        </Text>
    );

    const checkProfile = () => {
        const parentNav = navigation.getParent();
        parentNav?.navigate({
            name: "Profile",
            params: { visitor_id: item.user.id_user },
        });
    };

    return (
        <View style={[styles.reviewItemContainer, { backgroundColor: colors.card.bg, borderColor: colors.card.border }]}>
            <Pressable
                onPress={gotoDetails}
                onLongPress={() => !disableLongPress && setShowDialogModal(true)}
                style={styles.pressableWrapper}
            >
                <View style={styles.imageWrapper}>
                    {imageLoading && (
                        <View style={[styles.reviewItemImage, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                            <ActivityIndicator size="large" color="#007bff" />
                        </View>
                    )}
                    <Image
                        style={styles.reviewItemImage}
                        source={
                            item.imagePublicId
                                ? { uri: transformCloudinaryImageSize(item.imagePublicId, "medium") }
                                : require('../assets/placeholder.jpg')
                        }
                        contentFit='cover'
                        onLoadEnd={() => setImageLoading(false)}
                    />

                    <View style={[styles.categoryBadge, { backgroundColor: colors.card.bg }]}>
                        {checkCategoryIcon(item.category)}
                    </View>
                </View>
            </Pressable>

            <View style={styles.reviewItemInfoWrapper}>
                {imageLoading ? (
                    <>
                        <View style={{ height: 20, backgroundColor: '#ddd', marginBottom: 6, borderRadius: 4 }} />
                        <View style={{ height: 16, width: '50%', backgroundColor: '#ddd', marginBottom: 6, borderRadius: 4 }} />
                    </>
                ) : (
                    <>
                        <View style={{ minHeight: 55 }}>
                            <Text numberOfLines={2} ellipsizeMode='tail' style={[styles.reviewItemTitle, { color: colors.textColorPrimary, fontFamily: fonts.bold, fontSize: fontSizes.md }]}>
                                {item.reviewname}
                            </Text>
                        </View>

                        <View style={styles.ratingPriceRow}>
                            <View style={styles.starRatingS}>
                                <FontAwesome name="star" size={16} color={colors.card.star} />
                                <Text style={[styles.reviewItemRating, { color: colors.textColorPrimary, fontFamily: fonts.semiBold, fontSize: fontSizes.sm }]}>
                                    {item.reviewRating}
                                </Text>
                            </View>
                            {renderPriceRange(item.priceRange)}
                        </View>

                        <Pressable onPress={checkProfile}>
                            <View style={styles.profileImageContainer}>
                                <Image
                                    style={styles.profileImage}
                                    source={
                                        item.user?.avatar
                                            ? { uri: item.user.avatar }
                                            : require('../assets/placeholder.jpg')
                                    }
                                    contentFit='cover'
                                />
                                <Text style={[{ color: colors.textColorSecondary, fontFamily: fonts.medium }]}>
                                    {item.user.username}
                                </Text>
                            </View>
                        </Pressable>

                        <View style={styles.reviewItemTagsContainer}>
                            {item.reviewTaste.slice(0, 2).map((tasteItem, i) => {
                                const { color, textColor } = selectColor(tasteItem);
                                return (
                                    <View key={i} style={[styles.reviewItemTagBox, { backgroundColor: color }]}>
                                        <Text style={[styles.reviewItemTagText, { color: textColor, fontFamily: fonts.semiBold, fontSize: fontSizes.xxs }]}>
                                            {tasteItem}
                                        </Text>
                                    </View>
                                );
                            })}
                            {item.reviewTaste.length > 2 && (
                                <View style={[styles.reviewItemTagBox, { backgroundColor: "#E0E0E0" }]}>
                                    <Text style={[styles.reviewItemTagText, { color: "#333", fontFamily: fonts.semiBold, fontSize: fontSizes.xxs }]}>
                                        +{item.reviewTaste.length - 2}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </>
                )}
            </View>

            <View style={[styles.tagsSeparator, { borderBottomColor: colors.card.separator }]} />

            {!imageLoading && (
                <View style={styles.reviewItemIconsContainer}>
                    <Pressable disabled={isProcessing} onPress={handleLiking} style={styles.reviewItemIconWrapper}>
                        <FontAwesome name={likesState ? 'heart' : 'heart-o'} size={24} color={likesState ? '#ff4757' : colors.textColorSecondary} />
                        <Text style={[styles.reviewItemIconCount, { color: colors.textColorSecondary, fontFamily: fonts.medium }]}>
                            {item.likes?.length || 0}
                        </Text>
                    </Pressable>

                    <Pressable onPress={openCommentSection} style={styles.reviewItemIconWrapper}>
                        <MaterialCommunityIcons name="chat-outline" size={24} color={colors.textColorSecondary} />
                        <Text style={[styles.reviewItemIconCount, { color: colors.textColorSecondary, fontFamily: fonts.medium }]}>
                            {item.comments?.length || 0}
                        </Text>
                    </Pressable>
                </View>
            )}

            <ModalDialog
                dialogTitle={`Delete "${item.reviewname}"?`}
                showDescription
                visible={showDialogModal}
                onCancel={() => setShowDialogModal(false)}
                onDelete={handleDelete}
            />
        </View>
    );
};

export default ReviewItem;

const styles = StyleSheet.create({
    reviewItemContainer: {
        width: '48%',
        flexDirection: 'column',
        borderWidth: 2,
        borderRadius: 20,
        marginVertical: 8,
        marginHorizontal: 5,
        overflow: 'hidden',
    },
    pressableWrapper: {
        flex: 1,
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 0.8,
        position: 'relative',
        marginBottom: 8,
    },
    reviewItemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    categoryBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 6,
        borderRadius: 16,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewItemInfoWrapper: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'flex-start'
    },
    reviewItemTitle: {
        paddingBottom: 4,
    },
    ratingPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    starRatingS: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewItemRating: {
        marginLeft: 4,
    },
    reviewItemTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 6,
    },
    reviewItemTagBox: {
        borderRadius: 12,
        marginBottom: 4,
        paddingVertical: 3,
        paddingHorizontal: 6
    },
    profileImageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
        marginVertical: 10
    },
    profileImage: {
        height: screenWidth * 0.07,
        width: screenWidth * 0.07,
        borderRadius: screenWidth * 0.06,
    },
    reviewItemTagText: {
        textAlign: 'center',
    },
    tagsSeparator: {
        borderBottomWidth: 1,
    },
    reviewItemIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
    },
    reviewItemIconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    reviewItemIconCount: {
        marginLeft: 4,
    },
});


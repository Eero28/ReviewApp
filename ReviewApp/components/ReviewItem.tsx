import { FC, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Pressable,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ModalDialog from './ModalDialog';
import { useAuth } from '../providers/ContexApi';
import { ReviewItemIf } from '../interfaces/ReviewItemIf';
import { FontAwesome } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { selectColor } from '../helpers/tastegroup';
import { errorHandler } from '../helpers/errors/error';
import { categories } from '../helpers/categories';
import { likeReview } from '../helpers/services/reviewService';
import { screenHeight } from '../helpers/dimensions';
import { useTheme } from '../providers/ThemeContext';
import Icon from './Icon';
import axios from 'axios';
import { API_URL } from '@env';

type Props = {
    item: ReviewItemIf;
    disableLongPress?: boolean;
};

const ReviewItem: FC<Props> = ({ item, disableLongPress = false }) => {
    const { colors, fonts } = useTheme();
    const { deleteReview, userInfo, setReviewsUpdated, handleLogout } = useAuth();
    const navigation = useNavigation<any>();

    const [showDialogModal, setShowDialogModal] = useState<boolean>(false);
    const [likesState, setLikesState] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        if (userInfo && item.likes) {
            const liked = item.likes.some(like => like.user.id_user === userInfo.id_user);
            setLikesState(liked);
        }
    }, [item.likes, userInfo]);

    const handleLiking = async () => {
        if (isProcessing || !userInfo) return;
        setIsProcessing(true);
        try {
            if (likesState) {
                await axios.delete(`${API_URL}/likes/unlike/review/${item.id_review}/user/${userInfo.id_user}`);
            } else {
                await likeReview(item.id_review, userInfo.id_user);
            }
            setLikesState(prev => !prev);
            setReviewsUpdated(prev => !prev);
        } catch (error) {
            console.error("Error liking/unliking:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const gotoDetails = () => navigation.navigate('ReviewDetails', { item });
    const openCommentSection = () => navigation.navigate('ReviewDetails', { item, showComment: true });

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
        return category ? <Icon size={20} name={category.icon} /> : null;
    };

    const priceSymbolsMap: { [key: string]: number } = {
        '1-5': 1, '10-20': 2, '20-50': 3, '50-100': 4, '+100': 5,
    };

    const renderPriceRange = (range: string) => {
        return (
            <Text style={[styles.priceText, { color: colors.textColorPrimary, fontFamily: fonts.medium }]}>
                {'€'.repeat(priceSymbolsMap[range] || 1)}
            </Text>
        );
    };

    return (
        <View style={[styles.reviewItemContainer, { backgroundColor: colors.card.bg, borderColor: colors.card.border }]}>
            <Pressable
                onPress={gotoDetails}
                onLongPress={() => !disableLongPress && setShowDialogModal(true)}
                style={styles.pressableWrapper}
            >
                <View style={styles.imageWrapper}>
                    <Image style={styles.reviewItemImage} source={{ uri: item.imageUrl }} />
                    <View style={[styles.categoryBadge, { backgroundColor: colors.card.bg }]}>
                        {checkCategoryIcon(item.category)}
                    </View>
                </View>

                <Text numberOfLines={2} style={[styles.reviewItemTitle, { color: colors.textColorPrimary, fontFamily: fonts.bold }]}>
                    {item.reviewname}
                </Text>
            </Pressable>

            <View style={styles.reviewItemInfoWrapper}>
                <View style={styles.starRatingContainer}>
                    <View style={styles.starRatingS}>
                        <FontAwesome name="star" size={16} color={colors.card.star} />
                        <Text style={[styles.reviewItemRating, { color: colors.textColorPrimary }]}>{item.reviewRating}</Text>
                    </View>
                    <View style={[styles.priceBadge, { backgroundColor: colors.card.bg }]}>
                        {renderPriceRange(item.priceRange)}
                    </View>
                </View>

                <Text numberOfLines={1} style={[styles.reviewBy, { color: colors.textColorSecondary, fontFamily: fonts.medium }]}>
                    Reviewed by: {item.user.username}
                </Text>

                <View style={[styles.reviewItemTagsContainer]}>
                    {item.reviewTaste.slice(0, 3).map((tasteItem, i) => {
                        const { color, textColor } = selectColor(tasteItem);
                        return (
                            <View key={i} style={[styles.reviewItemTagBox, { backgroundColor: color }]}>
                                <Text style={[styles.reviewItemTagText, { color: textColor, fontFamily: fonts.semiBold }]}>
                                    {tasteItem}
                                </Text>
                            </View>
                        );
                    })}
                    {item.reviewTaste.length > 3 && (
                        <View style={[styles.reviewItemTagBox, { backgroundColor: colors.card.bg }]}>
                            <Text style={[styles.reviewItemTagText, { color: colors.textColorPrimary, fontFamily: fonts.semiBold }]}>
                                +{item.reviewTaste.length - 3}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={[styles.tagsSeparator, { borderBottomColor: colors.card.separator }]} />

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
        flexDirection: 'column',
        padding: 0,
        marginVertical: 8,
        width: '100%',
        borderWidth: 2,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    pressableWrapper: {
        width: '100%',
    },
    imageWrapper: {
        position: 'relative',
        width: '100%',
        marginBottom: 8,
    },
    reviewItemImage: {
        width: '100%',
        height: screenHeight * 0.30,
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
        width: '100%',
        paddingHorizontal: 10,
    },
    reviewItemTitle: {
        fontSize: 16,
        marginBottom: 4,
        marginLeft: 10,
    },
    reviewItemRating: {
        color: '#000',
        marginLeft: 5,
    },
    reviewBy: {
        fontSize: 14,
        marginBottom: 4,
    },
    starRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    starRatingS: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
        marginBottom: 6,
    },
    priceText: {
        fontSize: 12,
        fontWeight: '700',
    },
    reviewItemTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 6,
        minHeight: screenHeight / 13
    },
    reviewItemTagBox: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginBottom: 4,
    },
    reviewItemTagText: {
        fontSize: 12,
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
        fontSize: 16,
    },
});


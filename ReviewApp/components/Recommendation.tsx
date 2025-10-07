import { FC } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RecommendationSuggestion } from '../interfaces/Recommendation';
import { selectColor } from '../helpers/tastegroup';
import { screenWidth, screenHeight } from '../helpers/dimensions';
import { useTheme } from '../providers/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
  item: RecommendationSuggestion;
};

const CARD_WIDTH = screenWidth * 0.6;
const CARD_HEIGHT = screenHeight * 0.5;

const Recommendation: FC<Props> = ({ item }) => {
  const { colors, fonts } = useTheme();

  return (
    <View style={[styles.container, { width: CARD_WIDTH, height: CARD_HEIGHT, backgroundColor: colors.card.bg }]}>
      <Image source={{ uri: item.review.imageUrl }} style={[styles.image, { height: CARD_HEIGHT * 0.4 }]} />
      <View style={styles.recommedationInfoContainer}>
        <View style={styles.starRatingContainer}>
          <FontAwesome name="star" size={16} color={colors.card.star} />
          <Text style={[styles.starRatingText, { color: colors.textColorPrimary }]}>{item.review.reviewRating}</Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={[styles.title, { color: colors.textColorPrimary, fontFamily: fonts.semiBold }]} numberOfLines={1}>
            {item.review.reviewname}
          </Text>
          <Text style={[styles.category, { color: colors.textColorSecondary, fontFamily: fonts.regular }]} numberOfLines={1}>
            Category: {item.review.category}
          </Text>
          <Text style={[styles.reviewer, { color: colors.textColorSecondary, fontFamily: fonts.regular }]} numberOfLines={1}>
            Reviewed by: {item.review.user.username}
          </Text>

          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="chat-outline" size={22} color={colors.textColorSecondary} />
            <Text style={[styles.commentCount, { color: colors.textColorSecondary, fontFamily: fonts.medium }]}>
              {item.review.comments?.length ?? 0}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.descriptionBoxesContainer}>
        {item.review.reviewTaste.slice(0, 3).map((tasteItem, index) => {
          const { color, textColor } = selectColor(tasteItem);
          return (
            <View key={index} style={[styles.descriptionBox, { backgroundColor: color }]}>
              <Pressable>
                <Text style={[styles.descriptionText, { color: textColor, fontFamily: fonts.medium }]} numberOfLines={1}>
                  {tasteItem}
                </Text>
              </Pressable>

            </View>
          );
        })}
        {item.review.reviewTaste.length > 3 && (
          <View style={[styles.reviewItemTagBox, { backgroundColor: colors.card.bg }]}>
            <Text style={[styles.reviewItemTagText, { color: colors.textColorPrimary, fontFamily: fonts.semiBold }]}>
              +{item.review.reviewTaste.length - 3}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Recommendation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderRadius: 16,
    padding: 10,
  },
  recommedationInfoContainer: {
    padding: 5
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  starRatingContainer: {
    flexDirection: "row",
    paddingTop: 10,
  },
  starRatingText: {
    marginLeft: 5
  },
  cardInfo: {
    justifyContent: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 16,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  category: {
    fontSize: 14,
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  reviewer: {
    fontSize: 14,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    marginLeft: 6,
    fontSize: 16,
  },
  descriptionBoxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginRight: 10,
  },
  descriptionBox: {
    padding: 8,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 55
  },
  descriptionText: {
    fontSize: 10,
    textAlign: 'center',
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
});

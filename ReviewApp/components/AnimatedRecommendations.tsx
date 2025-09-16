import { FC } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Recommendation from './Recommendation';
import { RecommendationSuggestion } from '../interfaces/Recommendation';
import { useNavigation } from '@react-navigation/native';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { screenWidth, screenHeight } from '../helpers/dimensions';
import { useTheme } from '../providers/ThemeContext';

type Props = {
    recommendations: RecommendationSuggestion[];
    onCardPress: () => void;
};

const CARD_WIDTH = screenWidth * 0.6;
const CARD_HEIGHT = screenHeight * 0.5;
const CARD_MARGIN = 16;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;

const AnimatedRecommendations: FC<Props> = ({ recommendations, onCardPress }) => {
    const { colors } = useTheme()
    const scrollX = useSharedValue(0);
    const navigation = useNavigation<any>();

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollX.value = event.contentOffset.x;
    });

    return (
        <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'flex-end' }}
        >
            {recommendations.map((item, index) => {
                const animatedStyle = useAnimatedStyle(() => {
                    const scale = interpolate(
                        scrollX.value,
                        [(index - 1) * SNAP_INTERVAL, index * SNAP_INTERVAL, (index + 1) * SNAP_INTERVAL],
                        [0.95, 1, 0.95],
                        Extrapolation.CLAMP
                    );

                    const translateY = interpolate(
                        scrollX.value,
                        [(index - 1) * SNAP_INTERVAL, index * SNAP_INTERVAL, (index + 1) * SNAP_INTERVAL],
                        [10, 0, 10],
                        Extrapolation.CLAMP
                    );

                    return {
                        transform: [{ scale }, { translateY }],
                    };
                });

                return (
                    <Animated.View
                        key={index}
                        style={[styles.cardWrapper, { width: CARD_WIDTH, height: CARD_HEIGHT, backgroundColor: colors.bg }, animatedStyle]}
                    >
                        <Pressable
                            style={{ borderRadius: 16, flex: 1 }}
                            onPress={() => {
                                onCardPress();
                                navigation.navigate('ReviewDetails', { item: item.review });
                            }}
                        >
                            <Recommendation item={item} />
                        </Pressable>
                    </Animated.View>
                );
            })}
        </Animated.ScrollView>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        marginRight: CARD_MARGIN,
        borderRadius: 16,
        shadowColor: '#000',
        overflow: 'hidden',
    },
});

export default AnimatedRecommendations;

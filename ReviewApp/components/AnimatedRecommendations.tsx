import React, { FC, useRef } from 'react';
import { Animated, StyleSheet, Pressable } from 'react-native';
import Recommendation from './Recommendation';
import { RecommendationSuggestion } from '../interfaces/Recommendation';
import { useNavigation } from '@react-navigation/native';
import { screenWidth, screenHeight } from '../helpers/dimensions';

type Props = {
    recommendations: RecommendationSuggestion[];
    onCardPress: () => void;
};

// Make cards proportional to screen
const CARD_WIDTH = screenWidth * 0.6;   // 60% of screen width
const CARD_HEIGHT = screenHeight * 0.5; // 50% of screen height
const CARD_MARGIN = 16;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;

const AnimatedRecommendations: FC<Props> = ({ recommendations, onCardPress }) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation<any>();
    const touchStartXRefs = useRef<number[]>([]);

    return (
        <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            scrollEventThrottle={16}
            contentContainerStyle={{
                paddingHorizontal: 16,
                alignItems: 'flex-end',
            }}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
            )}
        >
            {recommendations.map((item, index) => {
                const inputRange = [
                    (index - 1) * SNAP_INTERVAL,
                    index * SNAP_INTERVAL,
                    (index + 1) * SNAP_INTERVAL,
                ];

                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.95, 1, 0.95],
                    extrapolate: 'clamp',
                });

                const translateY = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 0, 10],
                    extrapolate: 'clamp',
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.cardWrapper,
                            { width: CARD_WIDTH, height: CARD_HEIGHT, transform: [{ scale }, { translateY }] },
                        ]}
                    >
                        <Pressable
                            style={{ borderRadius: 16 }}
                            onTouchStart={(e) => {
                                touchStartXRefs.current[index] = e.nativeEvent.pageX;
                            }}
                            onTouchEnd={(e) => {
                                const dx = Math.abs(
                                    e.nativeEvent.pageX - (touchStartXRefs.current[index] || 0)
                                );
                                if (dx < 5) {
                                    onCardPress();
                                    navigation.navigate('ReviewDetails', { item: item.review });
                                }
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
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
        overflow: 'hidden',
    },
});

export default AnimatedRecommendations;

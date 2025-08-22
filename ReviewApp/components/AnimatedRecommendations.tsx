import React, { FC, useRef } from 'react';
import { Animated, StyleSheet, Pressable } from 'react-native';
import Recommendation from './Recommendation';
import { RecommendationSuggestion } from '../interfaces/Recommendation';
import { useNavigation } from '@react-navigation/native';

type Props = {
    recommendations: RecommendationSuggestion[];
};

const CARD_WIDTH = 280;
const CARD_MARGIN = 16;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;

const AnimatedRecommendations: FC<Props> = ({ recommendations }) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation<any>();

    // Track touch start positions for each card
    const touchStartXRefs = useRef<number[]>([]);

    return (
        <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContainer}
        >
            {recommendations.map((item, index) => {
                const inputRange = [
                    (index - 1) * SNAP_INTERVAL,
                    index * SNAP_INTERVAL,
                    (index + 1) * SNAP_INTERVAL,
                ];

                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.9, 1, 0.9],
                    extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.6, 1, 0.6],
                    extrapolate: 'clamp',
                });

                return (
                    <Animated.View
                        key={index}
                        style={[styles.cardWrapper, { transform: [{ scale }], opacity }]}
                    >
                        <Pressable
                            style={{ borderRadius: 16 }}
                            onTouchStart={(e) => {
                                touchStartXRefs.current[index] = e.nativeEvent.pageX;
                            }}
                            onTouchEnd={(e) => {
                                const dx = Math.abs(e.nativeEvent.pageX - (touchStartXRefs.current[index] || 0));
                                if (dx < 5) {
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
    scrollContainer: {
        paddingHorizontal: CARD_MARGIN / 2,
        alignItems: 'center',
    },
    cardWrapper: {
        width: CARD_WIDTH,
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

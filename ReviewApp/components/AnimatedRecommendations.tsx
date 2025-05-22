import React, { FC, useRef } from 'react';
import { Animated } from 'react-native';
import Recommendation from './Recommendation';
import { RecommendationSuggestion } from '../interfaces/Recommendation';

type Props = {
    recommendations: RecommendationSuggestion[];
};


const AnimatedRecommendations: FC<Props> = ({ recommendations }) => {
    const scrollX = useRef(new Animated.Value(0)).current;

    return (
        <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={320} // card width + margins
            decelerationRate="fast"
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
        >
            {recommendations?.map((item, index) => {
                const inputRange = [
                    (index - 1) * 320,
                    index * 320,
                    (index + 1) * 320,
                ];

                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.95, 1, 0.95],
                    extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.7, 1, 0.7],
                    extrapolate: 'clamp',
                });

                return (
                    <Animated.View
                        key={index}
                        style={{
                            transform: [{ scale }],
                            opacity,
                        }}
                    >
                        <Recommendation item={item} />
                    </Animated.View>
                );
            })}
        </Animated.ScrollView>
    );
};

export default AnimatedRecommendations;

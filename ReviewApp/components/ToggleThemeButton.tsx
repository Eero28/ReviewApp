import { View, Pressable, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor,
    interpolate
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from '../providers/ThemeContext';

const ToggleThemeButton = () => {
    const { toggleTheme, colors, scheme } = useTheme();
    const progress = useSharedValue(scheme === 'dark' ? 1 : 0);

    const handlePress = () => {
        progress.value = withTiming(progress.value === 0 ? 1 : 0, { duration: 300 });
        toggleTheme();
    };

    const thumbAnimatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(progress.value, [0, 1], [2, 88]); // modify arrays to change the width or area where icons are
        return { transform: [{ translateX }] };
    });

    // Background color transition
    const pressableAnimatedStyle = useAnimatedStyle(() => {
        const bgColor = interpolateColor(
            progress.value,
            [0, 1],
            [colors.card.bg, colors.textColorPrimary]
        );
        return { backgroundColor: bgColor };
    });

    const sunAnimatedStyle = useAnimatedStyle(() => ({
        opacity: 1 - progress.value,
    }));
    const moonAnimatedStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.pressable, pressableAnimatedStyle]}>
                <Pressable
                    onPress={handlePress}
                    style={styles.pressableInner}
                >
                    <Animated.View style={[styles.thumb, thumbAnimatedStyle]}>
                        <Animated.View style={[styles.iconWrapper, sunAnimatedStyle]}>
                            <Ionicons name="sunny" size={20} color={colors.textColorPrimary} />
                        </Animated.View>
                        <Animated.View style={[styles.iconWrapper, moonAnimatedStyle, { position: 'absolute' }]}>
                            <MaterialCommunityIcons name="weather-night" size={20} color={colors.bg} />
                        </Animated.View>
                    </Animated.View>
                </Pressable>
            </Animated.View>
        </View>
    );
};

export default ToggleThemeButton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressable: {
        width: 130,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        padding: 2,
    },
    pressableInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    thumb: {
        width: 40,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

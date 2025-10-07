import { FC, ReactNode } from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../providers/ThemeContext';

interface GradientCardProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    colors?: [string, string];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    padding?: number;
    borderRadius?: number;
    marginBottom?: number;
}

const GradientCard: FC<GradientCardProps> = ({
    children,
    style,
    colors,
    start = { x: 0, y: 0 },
    end = { x: 1, y: 1 },
    padding = 14,
    borderRadius = 12,
    marginBottom = 16,
}) => {
    const { colors: themeColors } = useTheme();

    const gradientColors = colors || [
        themeColors.card.accentBlue + '33',
        themeColors.card.accentBlue + '77',
    ];

    return (
        <LinearGradient
            colors={gradientColors}
            start={start}
            end={end}
            style={[styles.wrapper, { padding, borderRadius, marginBottom }, style]}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        overflow: 'hidden',
    },
});

export default GradientCard;

import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../providers/ThemeContext';

const WelcomeScreen = () => {
    const { colors, fonts } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <Text style={[styles.text, { color: colors.textColorPrimary, fontFamily: fonts.bold }]}>
                Welcome! Please log in to see your reviews.
            </Text>
        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    text: { fontSize: 18, textAlign: 'center' },
});

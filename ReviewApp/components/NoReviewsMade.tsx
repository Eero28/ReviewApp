import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const NoReviewsMade = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>No reviews made for this category yet!</Text>
        </SafeAreaView>
    );
};

export default NoReviewsMade;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 20,
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 500,
        fontFamily: "poppins"
    },
});

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingScreen: React.FC = () => {
    return (
        <View style={[styles.container, { backgroundColor: "black" }]}>
            <ActivityIndicator size="large" color="#1ABC9C" />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 15,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

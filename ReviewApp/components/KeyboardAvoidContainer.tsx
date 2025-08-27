import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import React from 'react';

type Props = {
    children: React.ReactNode;
}

const KeyboardAvoidContainer = ({ children }: Props) => {
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default KeyboardAvoidContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 10,
    },
});

import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

interface ExpandableBoxProps {
    buttonState: boolean;
    setButtonState: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
    countReplies?: number;
}

const ExpandableBox = ({ buttonState, setButtonState, children, countReplies = 0 }: ExpandableBoxProps) => {

    const toggleBox = () => {
        setButtonState(!buttonState);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.headerButton} onPress={toggleBox}>
                <Text style={styles.buttonText}>
                    {buttonState ? `Show Replies (${countReplies})` : `Hide Replies (${countReplies})`}
                </Text>
            </TouchableOpacity>
            {!buttonState && countReplies > 0 && (
                <View style={styles.content}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
    },
    headerButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#1e90ff',
        alignSelf: 'flex-start',
        marginBottom: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    content: {
        backgroundColor: '#121314',
        padding: 10,
        borderRadius: 6,
    },
});

export default ExpandableBox;

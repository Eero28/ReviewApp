import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

interface HomeProps {
    buttonState: boolean;
    setButtonState: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const ExpandableBox = ({ buttonState, setButtonState, children }: HomeProps) => {
    const handleButton = () => {
        setButtonState(!buttonState);
    };

    return (
        <View style={styles.containerReply}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.expandableboxButton} onPress={handleButton}>
                    <Text style={styles.buttonText}>
                        {buttonState ? 'Replies' : '-'}
                    </Text>
                </TouchableOpacity>
            </View>

            {!buttonState && (
                <View style={styles.boxContent}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    containerReply: {
        padding: 0,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expandableboxButton: {
        backgroundColor: 'red',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4,
    },
    buttonText: {
        color: '#fff',
        padding: 4,
        textAlign: 'center',
    },
    boxContent: {
        backgroundColor: 'gray',
        padding: 10,
        marginTop: 5,
    },
});

export default ExpandableBox;

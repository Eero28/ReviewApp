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
            {!buttonState && (
                <View style={styles.boxContent}>
                    {children}
                </View>
            )}
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.expandableboxButton} onPress={handleButton}>
                    <Text style={styles.buttonText}>
                        {buttonState ? 'Replies' : 'hide replies'}
                    </Text>
                </TouchableOpacity>
            </View>
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
        backgroundColor: '#121314',
        padding: 10,
        marginTop: 5,
    },
});

export default ExpandableBox;

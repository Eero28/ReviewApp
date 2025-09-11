import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


type BackButtonProps = {
    color?: string;
    size?: number;
    background?: string;
    top?: number;
    left?: number;
};

const BackButton: React.FC<BackButtonProps> = ({
    color = '#fff',
    size = 30,
    background = 'rgba(0,0,0,0.5)',
    top = 20,
    left = 15,
}) => {
    const navigation = useNavigation<any>();

    return (
        <Pressable
            onPress={() => navigation.goBack()}
            style={[
                styles.button,
                { top, left, backgroundColor: background }
            ]}
        >
            <Ionicons name="arrow-back" size={size} color={color} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        borderRadius: 20,
        padding: 8,
    },
});

export default BackButton;

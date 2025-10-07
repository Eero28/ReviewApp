import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';

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
    const [disabled, setDisabled] = useState(false);

    const handleBack = () => {
        if (disabled) return;

        setDisabled(true);

        const parent = navigation.getParent();

        if (navigation.canGoBack()) {
            navigation.dispatch(CommonActions.goBack());
        } else if (parent?.canGoBack()) {
            parent.dispatch(CommonActions.goBack());
        }

        setTimeout(() => setDisabled(false), 500);
    };


    return (
        <Pressable
            onPress={handleBack}
            disabled={disabled}
            style={[styles.button, { top, left, backgroundColor: background, opacity: disabled ? 0.6 : 1 }]}
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

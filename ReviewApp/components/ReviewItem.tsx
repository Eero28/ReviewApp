import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { FC, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import ModalDialog from './ModalDialog';
import { useAuth } from '../ContexApi';
import { ReviewItemIf } from '../interfaces/reviewItemIf';
type Props = {
    item: ReviewItemIf;
    disableLongPress?: boolean; 
};

const ReviewItem: FC<Props> = ({ item, disableLongPress = false }) => {
    const { deleteReview, userInfo } = useAuth();
    const [showDialogModal, setShowDialogModal] = useState<boolean>(false);
    const [isLongPress, setIsLongPress] = useState<boolean>(false); 


    const navigation = useNavigation<any>();

    const showModal = () => {
        setShowDialogModal(true);
    };
    const closeModal = () => {
        setShowDialogModal(false);
    };


    const gotoDetails = () => {
        if (!isLongPress) {  
            navigation.navigate('ReviewDetails', { item: item });
        }
    };

    const handleDelete = () => {
        setShowDialogModal(false);
        if (userInfo && userInfo.access_token) {
            deleteReview(item.id_review, userInfo?.access_token);
        } else {
            Alert.alert("No access to delete!");
        }
    };

    const handlePressIn = () => {
        setIsLongPress(false); 
    };

    const handleLongPress = () => {
        if (!disableLongPress) {  
            setIsLongPress(true);  
            showModal();  
        }
    };

    return (
        <TouchableOpacity
            onLongPress={handleLongPress}
            onPressIn={handlePressIn}  
            onPress={gotoDetails}      
            style={styles.container}
        >
            <Image
                style={styles.image}
                source={{
                    uri: item.imageUrl,
                }}
            />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.reviewname}</Text>
                <Text style={styles.description}>{item.category}</Text>
                <Text style={styles.description}>Reviewed by: {item.user.username}</Text>
            </View>
            <ModalDialog 
                dialogTitle={`Delete "${item.reviewname}"?`} 
                visible={showDialogModal} 
                onCancel={closeModal} 
                onDelete={handleDelete} 
            />
        </TouchableOpacity>
    );
};

export default ReviewItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        elevation: 3,
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        fontFamily: 'poppins'
    },
    description: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'poppins'
    },
});

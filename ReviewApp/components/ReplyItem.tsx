import React, { FC, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
import { Comment } from '../interfaces/Comment';
import { useAuth } from '../providers/ContexApi';
import { calculateDate } from '../helpers/date';
import { API_URL } from '@env';
import ExpandableBox from './Expandablebox';
import ModalDialog from './ModalDialog';
import { countReplies } from '../helpers/services/commentService';

type Props = {
    reply: Comment;
    depth?: number;
    id_review: number;
    getReviewComments?: () => void;
    dialogOff: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReplyItem: FC<Props> = ({ reply, depth = 1, id_review, getReviewComments, dialogOff }) => {
    const { userInfo, handleLogout } = useAuth();
    const [replying, setReplying] = useState<boolean>(false);
    const [replyText, setReplyText] = useState<string>('');
    const [buttonOpen, setButtonOpen] = useState<boolean>(false);
    const [showDialogModal, setShowDialogModal] = useState<boolean>(false);

    const replyToComment = async () => {
        if (!replyText.trim()) {
            return;
        }
        try {
            await axios.post(`${API_URL}/comments/reply/${reply.id_comment}`, {
                text: replyText,
                id_review,
                id_user: userInfo?.id_user,
            });
            setReplyText('');
            setReplying(false);
            getReviewComments?.();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteCommentReply = async () => {
        try {
            await axios.delete(`${API_URL}/comments/${reply.id_comment}`, {
                headers: { Authorization: `Bearer ${userInfo?.access_token}` },
            });
            setShowDialogModal(false);
            getReviewComments?.();
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                alert('Token expired or invalid. Logging out...');
                await handleLogout();
            } else {
                alert('An error occurred while deleting the comment.');
            }
        }
    };


    // Bottom Sheet
    const toggleSheet = () => {
        setShowDialogModal(!showDialogModal);
    };
    return (
        <>
            <TouchableOpacity onLongPress={toggleSheet}>
                <View style={[{ marginLeft: Math.min(depth * -20, 10) }, styles.replyContainer]}>
                    <Image
                        source={{
                            uri:
                                reply.user?.avatar ||
                                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                        }}
                        style={styles.profileImage}
                    />
                    <View style={styles.replyTextContainer}>
                        <Text style={styles.commentUser}>{reply.user?.username ?? 'Anonymous'}:</Text>
                        <Text style={styles.commentText}>{reply.text}</Text>
                        <Text style={styles.dateText}>{calculateDate(reply.createdAt)}</Text>

                        <TouchableOpacity onPress={() => setReplying(!replying)} style={styles.replyButton}>
                            <Text style={styles.replyButtonText}>Reply</Text>
                        </TouchableOpacity>

                        {replying && (
                            <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    style={styles.replyInput}
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChangeText={setReplyText}
                                />
                                <TouchableOpacity onPress={replyToComment} style={styles.submitButton}>
                                    <Text style={styles.submitButtonText}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {reply.replies?.length > 0 &&
                            reply.replies.map((child) => (
                                <ExpandableBox countReplies={countReplies(reply)} setButtonState={setButtonOpen} key={child.id_comment} buttonState={buttonOpen}>
                                    <ReplyItem
                                        dialogOff={dialogOff}
                                        reply={child}
                                        depth={depth + 1}
                                        id_review={id_review}
                                        getReviewComments={getReviewComments}
                                    />
                                </ExpandableBox>
                            ))}

                    </View>
                </View>
            </TouchableOpacity>
            <ModalDialog
                onDelete={deleteCommentReply}
                onCancel={toggleSheet}
                dialogTitle="Delete Comment!"
                visible={showDialogModal}
                showDescription
            />

        </>
    );
};

export default ReplyItem;

const styles = StyleSheet.create({
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    replyContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    replyTextContainer: {
        marginLeft: 10,
        flex: 1,
    },
    commentUser: {
        fontWeight: '700',
        fontSize: 14,
        color: 'white',
    },
    commentText: {
        fontSize: 13,
        marginTop: 4,
        lineHeight: 18,
        color: 'white',
    },
    dateText: {
        fontSize: 11,
        color: '#999',
        marginTop: 2,
    },
    replyButton: {
        marginTop: 6,
        paddingVertical: 2,
    },
    replyButtonText: {
        color: '#1e90ff',
        fontSize: 12,
        fontWeight: '500',
    },
    replyInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 13,
        backgroundColor: '#f5f5f5',
    },
    submitButton: {
        marginLeft: 6,
        backgroundColor: '#1e90ff',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
});

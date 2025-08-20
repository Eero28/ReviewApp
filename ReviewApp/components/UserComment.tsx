import { FC, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
import ModalDialog from './ModalDialog';
import ExpandableBox from './Expandablebox';
import { Comment } from '../interfaces/Comment';
import { useAuth } from '../ContexApi';
import { calculateDate } from '../helpers/date';
import ReplyItem from './ReplyItem';
// @ts-expect-error
import { API_URL } from '@env';

type Props = {
  item: Comment;
  getReviewComments?: () => void;
  id_review: number;
};

const UserComment: FC<Props> = ({ item, getReviewComments, id_review }) => {
  const { userInfo, handleLogout } = useAuth();
  const [showDialogModal, setShowDialogModal] = useState(false);
  const [minimizeOpen, setMinimizeOpen] = useState(true);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const deleteComment = async () => {
    try {
      await axios.delete(`${API_URL}/comments/${item.id_comment}`, {
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

  const replyToComment = async () => {
    if (!replyText.trim()) return;
    try {
      await axios.post(`${API_URL}/comments/reply/${item.id_comment}`, {
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

  // Bottom Sheet
  const toggleSheet = () => {
    setShowDialogModal(!showDialogModal);
  };

  return (
    <>
      <ModalDialog
        onDelete={deleteComment}
        onCancel={() => setShowDialogModal(false)}
        dialogTitle="Delete Comment!"
        visible={showDialogModal}
      />

      <TouchableOpacity onLongPress={toggleSheet}>
        <View style={styles.commentWrapper}>
          <Image
            source={{
              uri:
                item.user?.avatar ||
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            }}
            style={styles.profileImage}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.commentUser}>{item.user.username}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.dateText}>{calculateDate(item.createdAt)}</Text>

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

            {item.replies?.length > 0 && (
              <ExpandableBox buttonState={minimizeOpen} setButtonState={setMinimizeOpen}>
                {item.replies.map((reply) => (
                  <ReplyItem
                    key={reply.id_comment}
                    reply={reply}
                    id_review={id_review}
                    getReviewComments={getReviewComments}
                  />
                ))}
              </ExpandableBox>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default UserComment;

const styles = StyleSheet.create({
  commentWrapper: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#121314',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  commentUser: {
    fontWeight: '700',
    fontSize: 15,
    color: 'white',
  },
  commentText: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
    color: 'white',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  replyButton: {
    marginTop: 6,
    paddingVertical: 2,
  },
  replyButtonText: {
    color: '#1e90ff',
    fontSize: 13,
    fontWeight: '500',
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    backgroundColor: '#f5f5f5',
  },
  submitButton: {
    marginLeft: 8,
    backgroundColor: '#1e90ff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

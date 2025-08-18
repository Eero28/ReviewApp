import { FC, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Button } from 'react-native';
import axios from 'axios';
import ModalDialog from './ModalDialog';
import ExpandableBox from './Expandablebox';
import { Comment } from '../interfaces/Comment';
import { useAuth } from '../ContexApi';
import { calculateDate } from '../helpers/date';
// @ts-expect-error: Ignore the issue with the import from @env
import { API_URL } from '@env';

type Props = {
  item: Comment;
  getReviewComments?: () => void;
  disableCommentDelete?: boolean;
  id_review: number;
};

const UserComment: FC<Props> = ({ item, getReviewComments, disableCommentDelete, id_review }) => {
  const { userInfo, handleLogout } = useAuth();
  const [showDialogModal, setShowDialogModal] = useState(false);
  const [minimizeOpen, setMinimizeOpen] = useState(true);

  // Recursive replies with depth
  const renderReplies = (list: Comment[] = [], depth = 1) => {
    return list.map((reply) => {
      return (
        <View
          key={reply.id_comment}
          style={[styles.replyContainer, { paddingLeft: depth * 15 }]}
        >
          <Text style={styles.commentUser}>{reply.user?.username ?? 'Anonymous'}:</Text>
          <Text style={styles.commentText}>{reply.text}</Text>
          <Text style={styles.dateText}>{calculateDate(reply.createdAt)}</Text>
          {reply.replies && reply.replies.length > 0 && (
            <View>{renderReplies(reply.replies, depth + 1)}</View>
          )}
        </View>
      );
    });
  };


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
    try {
      await axios.post(`${API_URL}/comments/reply/${item.id_comment}`, { text: "client!", id_review: id_review, id_user: userInfo?.id_user })
      getReviewComments?.();
    } catch (error: any) {

    }
  }
  return (
    <>
      <ModalDialog
        onDelete={deleteComment}
        onCancel={() => setShowDialogModal(false)}
        dialogTitle="Delete Comment!"
        visible={showDialogModal}
      />
      <TouchableOpacity
        onLongPress={() => !disableCommentDelete && setShowDialogModal(true)}
        disabled={disableCommentDelete}
      >
        <View style={styles.commentContainer}>
          <Image
            source={{
              uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            }}
            style={styles.profileImage}
          />
          <View style={styles.userInfoContainer}>
            <Text style={styles.commentUser}>{item.user.username}:</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.dateText}>{calculateDate(item.createdAt)}</Text>
            <TouchableOpacity onPress={replyToComment}>
              <Text style={{ padding: 12 }}>Reply</Text>
            </TouchableOpacity>
            {item.replies && item.replies.length > 0 && (
              <ExpandableBox
                buttonState={minimizeOpen}
                setButtonState={setMinimizeOpen}
              >
                {renderReplies(item.replies)}
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
  commentContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  userInfoContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  commentUser: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    fontSize: 16,
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ddd',
    marginTop: 10,
  },
  replyContainer: {
    marginTop: 8,
  },
});

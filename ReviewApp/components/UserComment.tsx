import React, { FC, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
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
};

const UserComment: FC<Props> = ({ item, getReviewComments, disableCommentDelete }) => {
  const { userInfo, handleLogout } = useAuth();
  const [showDialogModal, setShowDialogModal] = useState(false);
  const [minimizeOpen, setMinimizeOpen] = useState(true);

  const renderReplies = (list: Comment[]) =>
    list.map(reply => (
      <View key={reply.id_comment} style={styles.replyContainer}>
        <Text style={styles.commentUser}>{reply.user?.username}:</Text>
        <Text style={styles.commentText}>{reply.text}</Text>
        {reply.replies?.length ? renderReplies(reply.replies) : null}
      </View>
    ));

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
            <ExpandableBox buttonState={minimizeOpen} setButtonState={setMinimizeOpen}>
              {renderReplies(item.replies || [])}
            </ExpandableBox>
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
    paddingLeft: 15,
  },
});

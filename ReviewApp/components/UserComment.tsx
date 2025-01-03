import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { FC, useState } from 'react'
import ModalDialog from './ModalDialog';
import { Comment } from '../interfaces/Comment';
import { useAuth } from '../ContexApi';
//@ts-ignore
import { API_URL } from '@env';
import axios from 'axios';
type Props = {
  item: Comment,
  getReviewComments?: () => void;
  disableCommentDelete?: boolean;
}

const UserComment: FC<Props> = ({ item, getReviewComments, disableCommentDelete }) => {

  const { userInfo } = useAuth()
  const [showDialogModal, setShowDialogModal] = useState<boolean>(false);


  const showModal = () => {
    if (disableCommentDelete) return;
    setShowDialogModal(true);
  };
  const closeModal = () => {
    setShowDialogModal(false);
  };

  


  const deleteComment = async () => {
    console.log(item)
    try {
      await axios.delete(`${API_URL}/comments/${item.id_comment}`, {
        headers: {
          "Authorization": `Bearer ${userInfo?.access_token}`
        }
      })
      closeModal()
      if(!getReviewComments){
        return
      }
      getReviewComments()
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <ModalDialog onDelete={deleteComment} onCancel={closeModal} dialogTitle='Delete Comment!' visible={showDialogModal} />
      <TouchableOpacity onLongPress={showModal}>
        <View style={styles.commentContainer}>
          <Text style={styles.commentUser}>{item.user.username}:</Text>
          <Text style={styles.commentText}>{item.text}</Text>
          <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      </TouchableOpacity>
    </>
  )
}

export default UserComment

const styles = StyleSheet.create({
  commentContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    flex: 1

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
})
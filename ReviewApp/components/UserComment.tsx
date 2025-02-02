import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { FC, useState } from 'react'
import ModalDialog from './ModalDialog';
import { Comment } from '../interfaces/Comment';
import { useAuth } from '../ContexApi';
import { calculateDate } from '../helpers/date';
//@ts-ignore
import { API_URL } from '@env';
import axios from 'axios';
type Props = {
  item: Comment,
  getReviewComments?: any;
  disableCommentDelete?: boolean;
}

const UserComment: FC<Props> = ({ item, getReviewComments, disableCommentDelete }) => {

  const { userInfo, handleLogout } = useAuth()
  const [showDialogModal, setShowDialogModal] = useState<boolean>(false);


  const showModal = () => {
    if (disableCommentDelete) return;
    setShowDialogModal(true);
  };
  const closeModal = () => {
    setShowDialogModal(false);
  };

  

  const deleteComment = async () => {
    console.log('Comment deleted')
    try {
      await axios.delete(`${API_URL}/comments/${item.id_comment}`, {
        headers: {
          "Authorization": `Bearer ${userInfo?.access_token}`
        }
      })
      closeModal()
      if (!getReviewComments) {
        return
      }
      getReviewComments()
    }
    catch (error) {
      console.log(error)
      if (error.response && error.response.status === 401) {
        alert("Token expired or invalid. Logging out...");
        await handleLogout();
    }
    }
  }
  return (
    <>
      <ModalDialog onDelete={deleteComment} onCancel={closeModal} dialogTitle='Delete Comment!' visible={showDialogModal} />
      <TouchableOpacity onLongPress={showModal}>
        <View style={styles.commentContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.commentUser}>{item.user.username}:</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.dateText}>{calculateDate(item.createdAt)}</Text>
          </View>
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
    flex: 1,
    flexDirection: 'row'
  },
  userInfoContainer: {
    paddingLeft: 10
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
  profileImageContainer: {
    marginTop: 10
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#ddd",
    padding: 10
  },
})
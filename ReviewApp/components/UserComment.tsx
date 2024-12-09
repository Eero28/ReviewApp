import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'

type Props = {
  item: any
}

const UserComment: FC<Props> = ({ item }) => {
  console.log(item)
  return (
    <View style={styles.commentContainer}>
      <Text style={styles.commentUser}>{item.user.username}:</Text>
      <Text style={styles.commentText}>{item.text}</Text>
      <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </View>
  )
}

export default UserComment

const styles = StyleSheet.create({
  commentContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9', // Ensure visibility
    borderRadius: 8,
    borderWidth: 1, // Temporary border for debugging
    borderColor: '#ccc', // Temporary border for debugging
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
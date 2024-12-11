import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { FC } from 'react';
import { Comment } from '../interfaces/comment';

interface Comments {
  comments: Comment[];
}

const CommentsList: FC<Comments> = ({ comments }) => {
  return (
    <View>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Text style={styles.commentUser}>{item.user.username}:</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id_comment.toString()}
      />
    </View>
  );
};

export default CommentsList;

const styles = StyleSheet.create({
  commentContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
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
});

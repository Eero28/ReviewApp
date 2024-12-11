import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { FC } from 'react';
import { Comment } from '../interfaces/Comment';
import UserComment from './UserComment';

interface Comments {
  comments: Comment[];
}

const CommentsList: FC<Comments> = ({ comments }) => {
  return (
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <UserComment item={item}/>
        )}
        keyExtractor={(item) => item.id_comment.toString()}
      />
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

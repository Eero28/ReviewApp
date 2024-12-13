import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { FC } from 'react';
import { Comment } from '../interfaces/Comment';
import UserComment from './UserComment';

interface Comments {
  comments: Comment[];
}

const CommentsList: FC<Comments> = ({ comments }) => {
  const empyList = () =>{
    return(
      <View>
        <Text>No Comments yet. Be The first one to comment!</Text>
      </View>
    )
  }
  return (
    <FlatList
      data={comments}
      renderItem={({ item }) => <UserComment item={item} />}
      keyExtractor={(item) => item.id_comment.toString()}
      nestedScrollEnabled={true} 
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={empyList}
    />
  );
};

export default CommentsList;

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
  },
});

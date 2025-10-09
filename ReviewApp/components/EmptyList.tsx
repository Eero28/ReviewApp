import { StyleSheet, Text, View } from 'react-native';

const EmptyList = () => (
  <View style={styles.emptyListContainer}>
    <Text style={styles.emptyListText}>No Comments yet. Be the first to comment! 😊</Text>
  </View>
);

export default EmptyList;

const styles = StyleSheet.create({
  emptyListContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyListText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

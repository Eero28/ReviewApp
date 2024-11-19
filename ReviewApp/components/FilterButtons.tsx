import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'

import { useAuth } from '../ContexApi'

type Props = {
    reviewsWithCategory: (category?: any) => void;
}

const FilterButtons: FC<Props> = ({reviewsWithCategory}) => {
  return (
    <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={ () => reviewsWithCategory("beer")} style={styles.button}>
          <Text style={styles.buttonText}>Beer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => reviewsWithCategory("wine")} style={styles.button}>
          <Text style={styles.buttonText}>Wine</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => reviewsWithCategory("softdrink")} style={styles.button}>
          <Text style={styles.buttonText}>Softdrink</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => reviewsWithCategory()} style={styles.button}>
          <Text style={styles.buttonText}>All</Text>
        </TouchableOpacity>
      </View>
  )
}

export default FilterButtons

const styles = StyleSheet.create({
    buttonContainer: {
      display: "flex",
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
      paddingHorizontal: 10,
    },
    button: {
      backgroundColor: '#6200EE',
      paddingVertical: 8,
      borderRadius: 5,
      width: '22%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
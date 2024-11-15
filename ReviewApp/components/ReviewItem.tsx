import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {reviewname: string}

const ReviewItem = (props: Props) => {
  return (
    <View>
      <Text>{props.reviewname}</Text>
    </View>
  )
}

export default ReviewItem

const styles = StyleSheet.create({})
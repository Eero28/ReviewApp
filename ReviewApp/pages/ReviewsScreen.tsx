import { StyleSheet, Text, View, FlatList, SafeAreaView, } from 'react-native'
import React from 'react'
import { useAuth } from '../ContexApi'
import ReviewItem from '../components/ReviewItem'

type Props = {}

const ReviewsScreen = (props: Props) => {
  const {userReviews} = useAuth()
  return (
    <SafeAreaView>
      <FlatList
        data={userReviews}
        renderItem={({item}) => <ReviewItem reviewname={item.reviewname} />}
        keyExtractor={item => item.id_review.toString()}
      />
    </SafeAreaView>
  )
}

export default ReviewsScreen

const styles = StyleSheet.create({})
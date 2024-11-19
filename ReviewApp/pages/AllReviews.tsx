import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ReviewFlatlist from '../components/ReviewFlatlist'
import { useAuth } from '../ContexApi'

type Props = {}

const AllReviews = (props: Props) => {
    const {allReviews} = useAuth()
  return (
      <ReviewFlatlist disableLongPress={true} reviews={allReviews}/>
  )
}

export default AllReviews

const styles = StyleSheet.create({})
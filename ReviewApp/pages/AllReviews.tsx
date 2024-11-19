import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ReviewFlatlist from '../components/ReviewFlatlist'
import { useAuth } from '../ContexApi'
import FilterButtons from '../components/FilterButtons'

type Props = {}

const AllReviews = (props: Props) => {
  const { allReviews, reviewsWithCategoryAll } = useAuth()
  return (
    <>
      <FilterButtons reviewsWithCategory={reviewsWithCategoryAll}/>
      <ReviewFlatlist disableLongPress={true} reviews={allReviews} />
    </>
  )
}

export default AllReviews

const styles = StyleSheet.create({})
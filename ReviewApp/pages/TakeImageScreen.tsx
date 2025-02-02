import {View } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native';
import ReviewForm from '../components/ReviewForm'
interface NavigationProps{
  navigation: NavigationProp<any>
}

const TakeImageScreen: React.FC<NavigationProps> = ({navigation}) => {
  return (
    <View>
      <ReviewForm navigation={navigation}/>
    </View>
  )
}

export default TakeImageScreen
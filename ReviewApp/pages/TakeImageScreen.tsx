import { View } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native';
import ReviewForm from '../components/ReviewForm'
import KeyboardAvoidContainer from '../components/KeyboardAvoidContainer';
interface NavigationProps {
  navigation: NavigationProp<any>
}

const TakeImageScreen: React.FC<NavigationProps> = ({ navigation }) => {
  return (
    <KeyboardAvoidContainer>
      <ReviewForm navigation={navigation} />
    </KeyboardAvoidContainer>
  )
}

export default TakeImageScreen
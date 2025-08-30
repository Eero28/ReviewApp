import React from 'react'
import { NavigationProp } from '@react-navigation/native';
import ReviewForm from '../components/ReviewForm'
import KeyboardAvoidContainer from '../components/KeyboardAvoidContainer';
interface NavigationProps {
  navigation: NavigationProp<any>
}

const TakeImageScreen: React.FC<NavigationProps> = () => {
  return (
    <KeyboardAvoidContainer>
      <ReviewForm />
    </KeyboardAvoidContainer>
  )
}

export default TakeImageScreen
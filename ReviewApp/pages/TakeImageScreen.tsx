import React from 'react'
import { NavigationProp } from '@react-navigation/native';
import ReviewForm from '../components/ReviewForm'
import KeyboardAvoidContainer from '../components/KeyboardAvoidContainer';

interface NavigationProps {
  navigation: NavigationProp<any>
  route: any
}

const TakeImageScreen: React.FC<NavigationProps> = ({ route }) => {
  const { isUpdate, initialImage, initialData } = route.params;

  return (
    <KeyboardAvoidContainer>
      <ReviewForm
        initialData={initialData}
        isUpdate={isUpdate}
        initialImage={initialImage}
      />
    </KeyboardAvoidContainer>
  )
}

export default TakeImageScreen;

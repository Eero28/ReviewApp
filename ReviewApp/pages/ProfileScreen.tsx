import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '../ContexApi'
import { NavigationProp, useNavigation } from '@react-navigation/native'
type Props = {}
interface NavigationProps{
  navigation: NavigationProp<any>
}

const ProfileScreen = ({}) => {
  const navigation = useNavigation()

  const {handleLogout} = useAuth()

  
  const handleUserLogout = () =>{
    handleLogout()
    navigation.goBack()
  }
  
  return (
    <View>
      <Text>ProfileScreen</Text>
      <Button onPress={handleUserLogout} title='Logout'></Button>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReviewsScreen from '../pages/ReviewsScreen';
import TakeImageScreen from '../pages/TakeImageScreen';
import { useAuth } from '../ContexApi';
import LoginScreen from '../pages/LoginScreen';

type Props = {}
const Tab = createBottomTabNavigator();

const TabNavigator = ({}) => {
  const {userInfo} = useAuth()
  if(!userInfo){
    return <LoginScreen/>
  }
  return (
    <Tab.Navigator>
      <Tab.Screen name="Reviews" component={ReviewsScreen} options={{headerShown: false}}/>
      <Tab.Screen name="Take Image" component={TakeImageScreen} options={{headerShown: false}} />
    </Tab.Navigator>
  )
}

export default TabNavigator

const styles = StyleSheet.create({})
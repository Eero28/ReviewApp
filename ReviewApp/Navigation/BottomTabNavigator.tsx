import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { useAuth } from '../ContexApi';
import MainTabs from './MainTabs';
import AuthTabs from './AuthTabs';

const BottomTabNavigator:FC = () => {
  const { userInfo } = useAuth()
  return userInfo ? <MainTabs/> : <AuthTabs/>
}

export default BottomTabNavigator

const styles = StyleSheet.create({})
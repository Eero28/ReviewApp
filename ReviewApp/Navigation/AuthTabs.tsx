import React, { FC } from 'react'
import LoginScreen from '../pages/LoginScreen'
import RegisterScreen from '../pages/RegisterScreen'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
const AuthTabs: FC = () => {
  return (
    <Tab.Navigator>
    <Tab.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="login" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Register"
      component={RegisterScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="app-registration" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
  )
}

export default AuthTabs
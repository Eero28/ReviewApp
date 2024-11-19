import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReviewsScreen from '../pages/ReviewsScreen';
import TakeImageScreen from '../pages/TakeImageScreen';
import { useAuth } from '../ContexApi';
import LoginScreen from '../pages/LoginScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import RegisterScreen from '../pages/RegisterScreen';
import AllReviews from '../pages/AllReviews';
import Ionicons from '@expo/vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

const TabNavigator:FC = () => {
  const { userInfo } = useAuth()
  if (!userInfo) {
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
    );
  }
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="My reviews"
        component={ReviewsScreen}
        options={{
          headerShown: false,  
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="reviews" size={size} color={color} /> 
          ),
        }}
      />
      <Tab.Screen
        name="Take Image"
        component={TakeImageScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="camera" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AllReviews"
        component={AllReviews}
        options={{
          headerShown: false,  
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-sharp" size={size} color={color} /> 
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator

const styles = StyleSheet.create({})
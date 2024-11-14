import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button } from 'react-native';
import ProfileScreen from './pages/ProfileScreen';
import TabNavigator from './components/TabNavigator';


const Drawer = createDrawerNavigator();




export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={TabNavigator}  />
        <Drawer.Screen name="Profile" component={ProfileScreen}  />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

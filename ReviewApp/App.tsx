import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppNavigator from './components/AppNavigator';
import { AuthProvider } from './ContexApi';

const Drawer = createDrawerNavigator();




export default function App() {
  return (
    <AuthProvider>
    <NavigationContainer>
      <AppNavigator/>
    </NavigationContainer>
    </AuthProvider>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './Navigation/MainNavigation';
import { AuthProvider } from './ContexApi';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
}

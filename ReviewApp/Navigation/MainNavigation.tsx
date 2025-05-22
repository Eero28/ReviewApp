import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReviewDetails from '../pages/ReviewDetails'
import DrawerNavigator from './DrawerNavigation';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#5073bd'
      },
      headerTintColor: '#ffffff'
    }}>
      <Stack.Screen
        name="MainApp"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewDetails"
        component={ReviewDetails}
        options={{ title: 'Review Details' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;

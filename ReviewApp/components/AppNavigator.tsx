// Importing necessary navigation components and other screens
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator'; // Tab navigation (Home, Reviews, etc.)
import ProfileScreen from '../pages/ProfileScreen'; // User profile screen
import ReviewDetails from '../pages/ReviewDetails'; // Individual review details
import { useAuth } from '../ContexApi'; // Custom hook for user authentication
import React from 'react';

type Props = {};

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const MainNavigation = (props: Props) => {
  const { userInfo } = useAuth(); 

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home">
        {() => (
          <Stack.Navigator>
            <Stack.Screen name="TabNavigator" options={{headerShown: false}} component={TabNavigator} />
            <Stack.Screen name="ReviewDetails" component={ReviewDetails} />
          </Stack.Navigator>
        )}
      </Drawer.Screen>
      {userInfo && (
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      )}
    </Drawer.Navigator>
  );
};

export default MainNavigation;

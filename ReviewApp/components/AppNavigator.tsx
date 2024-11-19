import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../pages/ProfileScreen';
import ReviewDetails from '../pages/ReviewDetails';
import { useAuth } from '../ContexApi';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native';

type Props = {};

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainNavigation = (props: Props) => {
  const { userInfo } = useAuth();
  
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#ffff',
        },
        drawerActiveTintColor: '#6200EE',
        drawerInactiveTintColor: '#B0B0B0',
      }}
    >
      <Drawer.Screen
        name="Home"
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="home" size={20} color={color} />
          )
        }}
      >
        {() => (
          <Stack.Navigator>
            <Stack.Screen name="TabNavigator" options={{ headerShown: false }} component={TabNavigator} />
            <Stack.Screen name="ReviewDetails" component={ReviewDetails} />
          </Stack.Navigator>
        )}
      </Drawer.Screen>
      {userInfo && (
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ color }) => (
              <AntDesign name="user" size={20} color={color} />
            ),
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default MainNavigation;

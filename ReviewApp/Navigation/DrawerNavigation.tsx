import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '../pages/ProfileScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../ContexApi';


const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { userInfo } = useAuth();
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#003366',
        },
        drawerActiveTintColor: '#ffffff',
        drawerInactiveTintColor: '#B0B0B0',
        headerStyle: {
          backgroundColor: '#003366'
        },
        headerTintColor: '#ffffff'
      }}
    >
      <Drawer.Screen
        name={userInfo?.username ? "Reviews" : "Welcome"}
        component={BottomTabNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="home" size={20} color={color} />
          ),
        }}
      />
      {userInfo && (
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ color }) => (
              <MaterialIcons name="account-circle" size={20} color={color} />
            ),
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

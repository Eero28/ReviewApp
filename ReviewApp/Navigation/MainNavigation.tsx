import React from 'react';
import { useTheme } from '../providers/ThemeContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TakeImageScreen from '../pages/TakeImageScreen';
import { MainStackParamList } from '../interfaces/Navigation';
import ReviewDetails from '../pages/ReviewDetails';
import DrawerNavigator from './DrawerNavigation';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigation: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.textColorPrimary,
      }}
    >
      <Stack.Screen
        name="MainApp"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ReviewDetails" component={ReviewDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TakeImage"
        component={TakeImageScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;

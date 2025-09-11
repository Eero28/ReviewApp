import { createStackNavigator } from '@react-navigation/stack';
import ReviewDetails from '../pages/ReviewDetails'
import DrawerNavigator from './DrawerNavigation';
import { useTheme } from '../providers/ThemeContext';
import TakeImageScreen from '../pages/TakeImageScreen';
import { MainStackParamList } from '../interfaces/navigation';


const Stack = createStackNavigator<MainStackParamList>();

const MainNavigation = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: colors.bg },
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.textColorPrimary,
      }}
    >
      <Stack.Screen
        name="MainApp"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewDetails"
        component={ReviewDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TakeImage"
        component={TakeImageScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;

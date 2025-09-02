import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '../pages/ProfileScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../ContexApi';
import Favorites from '../pages/Favorites';


const Drawer = createDrawerNavigator();


export type DrawerParamList = {
  Reviews: undefined;
  Profile: undefined;
  Favorites: undefined;
};

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
      {userInfo && (
        <Drawer.Screen
          name="Favorites"
          component={Favorites}
          options={{
            drawerIcon: ({ color }) => (
              <Ionicons name="heart" size={20} color={color} />
            ),
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

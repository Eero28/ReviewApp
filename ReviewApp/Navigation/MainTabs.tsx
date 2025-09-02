import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ReviewsScreen from '../pages/ReviewsScreen';
import TakeImageScreen from '../pages/TakeImageScreen';
import AllReviews from '../pages/AllReviews';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

export type BottomTabParamList = {
    Myreviews: undefined;
    TakeImage: undefined;
    AllReviews: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();


const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: '#B0C4DE',
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: '#003366',
                },
            }}
        >
            <Tab.Screen
                name="Myreviews"
                component={ReviewsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="reviews" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="TakeImage"
                component={TakeImageScreen}
                options={({ route }) => ({
                    tabBarLabel: '',
                    tabBarIcon: ({ size }) => (
                        <FontAwesome name="camera" size={size} color="white" />
                    ),
                    tabBarIconStyle: {
                        bottom: 20,
                        width: 60,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 30,
                        backgroundColor: '#1ABC9C',
                    },
                    tabBarStyle: route.name === 'TakeImage' ? { display: 'none' } : {},

                })}
            />
            <Tab.Screen
                name="AllReviews"
                component={AllReviews}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-sharp" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabs;


import { Pressable, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import ReviewsScreen from '../pages/ReviewsScreen';
import AllReviews from '../pages/AllReviews';
import { useTheme } from '../providers/ThemeContext';
import { BottomTabParamList } from '../interfaces/navigation';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const MainTabs = () => {
    const { colors } = useTheme();

    const EmptyComponent = () => {
        return (
            <View></View>
        )
    }

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.textColorPrimary,
                tabBarInactiveTintColor: colors.textColorSecondary,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: colors.bg,
                    borderTopWidth: 0,
                    elevation: 5,
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
                name="TakeImageButton"
                component={EmptyComponent}
                options={({ navigation }) => ({
                    tabBarLabel: '',
                    tabBarIcon: ({ size }) => (
                        <Pressable
                            onPress={() =>
                                navigation.navigate('TakeImage', {
                                    isUpdate: false,
                                    initialImage: null,
                                    initialData: {},
                                })
                            }
                            style={{
                                bottom: 20,
                                width: 60,
                                height: 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 30,
                                backgroundColor: colors.navigation.camera,
                            }}
                        >
                            <FontAwesome name="camera" size={size} color="white" />
                        </Pressable>
                    ),
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

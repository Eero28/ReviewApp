import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReviewsScreen from '../pages/ReviewsScreen';
import AllReviews from '../pages/AllReviews';
import { useTheme } from '../providers/ThemeContext';
import { BottomTabParamList } from '../interfaces/Navigation';
import { useAuth } from '../providers/ContexApi';
import WelcomeScreen from '../pages/WelcomeScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const MainTabs = () => {
    const { userInfo } = useAuth()
    const { colors } = useTheme();
    const Dummy = () => <View style={{ flex: 1, backgroundColor: colors.bg }} />;
    const [disabled, setDisabled] = useState<boolean>(false);

    // do not allow pressing many times
    const handleCameraPress = (navigation: any) => {
        if (disabled) return;
        setDisabled(true);
        navigation.navigate('TakeImage', {
            isUpdate: false,
            initialImage: null,
            initialData: {
                reviewname: '',
                reviewDescription: '',
                reviewRating: null,
                category: null,
                reviewTaste: [],
                priceRange: '',
            },
        });
        setTimeout(() => setDisabled(false), 1000);
    };

    const renderIconWithIndicator = (
        IconComponent: any,
        name: string,
        color: string,
        size: number,
        focused: boolean
    ) => (
        <View style={{ alignItems: 'center' }}>
            {focused && (
                <View
                    style={{
                        width: 50,
                        height: 3,
                        borderRadius: 2,
                        backgroundColor: colors.textColorPrimary,
                        marginBottom: 4,
                    }}
                />
            )}
            <IconComponent name={name} size={size} color={color} />
        </View>
    );

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.textColorPrimary,
                tabBarInactiveTintColor: colors.textColorSecondary,
                tabBarStyle: { backgroundColor: colors.bg },
            }}
        >
            <Tab.Screen
                name="Myreviews"
                component={userInfo ? ReviewsScreen : WelcomeScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) =>
                        renderIconWithIndicator(MaterialIcons, 'reviews', color, size, focused),
                }}
            />

            <Tab.Screen
                name="TakeImageButton"
                component={Dummy}
                options={({ navigation }) => ({
                    tabBarLabel: '',
                    tabBarButton: () => (
                        <Pressable
                            disabled={disabled}
                            onPress={() => handleCameraPress(navigation)}
                            style={{
                                position: 'absolute',
                                bottom: 20,
                                width: 60,
                                height: 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 30,
                                backgroundColor: disabled ? 'gray' : colors.navigation.camera,
                                alignSelf: 'center',
                            }}
                        >
                            <AntDesign name="plus" size={28} color="white" />
                        </Pressable>
                    ),
                })}
            />

            <Tab.Screen
                name="Feed"
                component={AllReviews}
                options={{
                    tabBarIcon: ({ color, size, focused }) =>
                        renderIconWithIndicator(Ionicons, 'people-sharp', color, size, focused),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabs;

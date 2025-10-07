import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from './providers/AppProviders';
import MainNavigation from './Navigation/MainNavigation';
import LoadingScreen from './components/LoadingScreen';
import { navigationRef } from './Navigation/NavigationService';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
          'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
          'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
          'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) return <LoadingScreen />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProviders>
          <NavigationContainer
            ref={navigationRef}
            onStateChange={() => {
              const currentRoute = navigationRef.getCurrentRoute();
              console.log("Current route:", currentRoute?.name);
            }}
          >
            <MainNavigation />
          </NavigationContainer>
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

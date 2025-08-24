import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import MainNavigation from './Navigation/MainNavigation';
import { AuthProvider } from './ContexApi';
import { CommentsProvider } from './CommentContextApi';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isFontLoaded, setFontLoaded] = useState(false);

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'poppins': require('./assets/fonts/Poppins-Regular.ttf'),
        });
        setFontLoaded(true);
        console.log('Fonts loaded successfully');
      } catch (e) {
        console.warn('Font loading failed:', e);
      }
    }
    loadFonts();
  }, []);
  useEffect(() => {
    if (isFontLoaded) {
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [isFontLoaded]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <CommentsProvider>
            <NavigationContainer>
              <MainNavigation />
            </NavigationContainer>
          </CommentsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

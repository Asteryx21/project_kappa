import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';


import RootStack from './navigators/RootStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from './CredentialsContext';

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState('');

  useEffect(() => {
    async function checkLoginCredentials() {
      try {
        const result = await AsyncStorage.getItem('projectKapaCredentials');
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
        setAppReady(true);
      } catch (error) {
        console.log(error);
      }
    }
    SplashScreen.preventAutoHideAsync();
    checkLoginCredentials();
  }, []);

  if (!appReady) {
    return null;
  }

  SplashScreen.hideAsync();
  return (
    <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
      <RootStack />
    </CredentialsContext.Provider>
  );
}
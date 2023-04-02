import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {Ionicons} from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CredentialsContext } from '../CredentialsContext';
//screens
import Login from '../screens/Login';
import Signup from '../screens/Signup'
import Welcome from '../screens/Welcome'
import CodeVerification from '../screens/CodeVerification';
import Maps from '../screens/Maps'
import CalendarScreen from '../screens/CalendarScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../styles/styles';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const RootStack = () => {
    return (
      <CredentialsContext.Consumer>
        {({ storedCredentials }) => (
          <>
          <StatusBar barStyle="light-content" backgroundColor={Colors.green} />
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              {storedCredentials ? (
                <Stack.Screen name="Main" options={{ headerShown: false }}>
                  {() => (
                    <Tab.Navigator
                    screenOptions={({route}) => ({
                        tabBarIcon: ({focused, size}) =>{
                            let iconName;
                            if (route.name == 'Welcome'){
                                iconName = focused ?  'ios-home' : 'ios-home-outline'
                                size = focused ? size + 8 : size + 5;
                            } else if (route.name == 'Maps'){
                                iconName = focused ?  'ios-map' : 'ios-map-outline'
                                size = focused ? size + 8 : size + 5;
                            } else if (route.name == 'CalendarScreen'){
                                iconName = focused ?  'ios-calendar' : 'ios-calendar-outline'
                                size = focused ? size + 8 : size + 5;
                            }
                            return <Ionicons name={iconName} size={size}/>
                        },
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: 'black',
                    tabBarStyle: {
                        backgroundColor: Colors.green,
                        height: 60
                    },
                    tabBarShowLabel: false

                
                    })}>
                      <Tab.Screen options={{ headerShown: false }} name="Welcome" component={Welcome} />
                      <Tab.Screen options={{ headerShown: false }} name="Maps" component={Maps} />
                      <Tab.Screen options={{ headerShown: false }} name="CalendarScreen" component={CalendarScreen} />
                    </Tab.Navigator>
                  )}
                </Stack.Screen>
              ) : (
                <>
                  <Stack.Screen
                    options={{ headerShown: false }}
                    name="Login"
                    component={Login}
                  />
                  <Stack.Screen name="Signup" component={Signup} />
                  <Stack.Screen
                    options={{ headerShown: false }}
                    name="CodeVerification"
                    component={CodeVerification}
                  />
                </>
              )}
            </Stack.Navigator>
            
          </NavigationContainer>
          </>
        )}
      </CredentialsContext.Consumer>
    );
  };

export default RootStack;
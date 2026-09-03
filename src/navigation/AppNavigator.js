import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import CleaningTypeScreen from '../screens/CleaningTypeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import LocationScreen from '../screens/LocationScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import BookingHistoryScreen from '../screens/BookingHistoryScreen';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();

/** Stack para usuarios no autenticados. */
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

/** Stack principal de la app (flujo de agendamiento). */
function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      <Stack.Screen name="CleaningType" component={CleaningTypeScreen} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
    </Stack.Navigator>
  );
}

/** Pantalla de carga mientras Firebase resuelve la sesion inicial. */
function SplashLoading() {
  return (
    <View style={styles.splash}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, initializing } = useAuth();

  return (
    <NavigationContainer>
      {initializing ? (
        <SplashLoading />
      ) : isAuthenticated ? (
        <AppStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
});

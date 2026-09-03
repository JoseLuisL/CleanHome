/**
 * Inicializacion de Firebase App y Auth con persistencia en AsyncStorage.
 *
 * En React Native, `getAuth` no persiste la sesion por defecto; por eso
 * usamos `initializeAuth` con `getReactNativePersistence(AsyncStorage)`.
 * Asi la sesion sobrevive al cierre de la app.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { firebaseConfig } from './firebaseConfig';

// Evita reinicializar la app en hot-reload.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // initializeAuth lanza si ya fue inicializado (p. ej. tras hot-reload).
  auth = getAuth(app);
}

export { app, auth };

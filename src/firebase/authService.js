/**
 * Wrapper de Firebase Authentication.
 *
 * Centraliza las llamadas al SDK para que las pantallas y el AuthContext
 * no importen `firebase/auth` directamente. Facilita testear y, si algun
 * dia cambias de proveedor, solo tocas este archivo.
 */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  onAuthStateChanged as fbOnAuthStateChanged,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
} from 'firebase/auth';

import { auth } from './firebase';

/** Inicia sesion con email y password. */
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

/**
 * Registra un usuario nuevo. Opcionalmente setea el displayName.
 * @returns {Promise<import('firebase/auth').User>}
 */
export async function register(email, password, displayName) {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    return credential.user;
  } catch (e) {
    // Log temporal para diagnosticar: muestra el codigo y mensaje reales.
    console.log('[register] error.code:', e.code);
    console.log('[register] error.message:', e.message);
    throw e;
  }
}

/** Cierra la sesion actual. */
export function logout() {
  return fbSignOut(auth);
}

/** Envia correo de recuperacion de contrasena. */
export function sendPasswordReset(email) {
  return fbSendPasswordResetEmail(auth, email.trim());
}

/**
 * Suscribe a cambios de sesion. Devuelve la funcion para desuscribir.
 * @param {(user: import('firebase/auth').User | null) => void} callback
 */
export function subscribeToAuthChanges(callback) {
  return fbOnAuthStateChanged(auth, callback);
}

/**
 * Traduce codigos de error de Firebase a mensajes en espanol.
 * @param {string} code - error.code de Firebase
 */
export function mapAuthError(code) {
  const messages = {
    'auth/invalid-email': 'El correo no es valido.',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
    'auth/user-not-found': 'No existe una cuenta con ese correo.',
    'auth/wrong-password': 'Correo o contrasena incorrectos.',
    'auth/invalid-credential': 'Correo o contrasena incorrectos.',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
    'auth/weak-password': 'La contrasena debe tener al menos 6 caracteres.',
    'auth/too-many-requests': 'Demasiados intentos. Intenta mas tarde.',
    'auth/network-request-failed': 'Error de red. Revisa tu conexion.',
    'auth/operation-not-allowed':
      'El metodo Email/Password no esta habilitado en Firebase. Actívalo en Authentication > Sign-in method.',
    'auth/configuration-not-found':
      'Falta configurar Authentication en Firebase. Habilita Email/Password en la consola.',
    'auth/api-key-not-valid': 'La apiKey de firebaseConfig no es valida.',
    'auth/invalid-api-key': 'La apiKey de firebaseConfig no es valida.',
  };
  return messages[code] || 'Ocurrio un error. Intenta nuevamente.';
}

export default {
  login,
  register,
  logout,
  sendPasswordReset,
  subscribeToAuthChanges,
  mapAuthError,
};

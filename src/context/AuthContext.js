import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

import authService from '../firebase/authService';

/**
 * Contexto de autenticacion.
 * Expone el usuario actual, el estado de carga inicial y las acciones
 * login / register / logout / resetPassword. Se apoya en el wrapper
 * src/firebase/authService para no acoplar la UI al SDK de Firebase.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Suscripcion al estado de sesion de Firebase.
  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback((email, password) => {
    return authService.login(email, password);
  }, []);

  const register = useCallback((email, password, displayName) => {
    return authService.register(email, password, displayName);
  }, []);

  const logout = useCallback(() => {
    return authService.logout();
  }, []);

  const resetPassword = useCallback((email) => {
    return authService.sendPasswordReset(email);
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      resetPassword,
      mapAuthError: authService.mapAuthError,
    }),
    [user, initializing, login, register, logout, resetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}

export default AuthContext;

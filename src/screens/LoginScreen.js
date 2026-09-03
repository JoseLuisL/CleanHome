import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Icon, TextInput, Snackbar, Button } from 'react-native-paper';

import LabeledInput from '../items/LabeledInput';
import PrimaryButton from '../items/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

/**
 * Pantalla de inicio de sesion.
 * Valida el formulario y llama a auth.login. Los cambios de sesion los
 * detecta AuthContext y el navigator muestra el flujo de la app.
 */
export default function LoginScreen({ navigation }) {
  const { login, mapAuthError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState('');

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'Ingresa tu correo';
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Correo invalido';
    if (!password) next.password = 'Ingresa tu contrasena';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      // No navegamos manualmente: AuthContext actualiza la sesion.
    } catch (e) {
      setSnack(mapAuthError(e.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logo}>
            <Icon source="home-heart" size={56} color={colors.primary} />
          </View>

          <Text variant="headlineMedium" style={styles.title}>
            Bienvenido de nuevo
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Inicia sesion para agendar tu limpieza
          </Text>

          <LabeledInput
            label="Correo electronico"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            left={<TextInput.Icon icon="email-outline" />}
            error={!!errors.email}
            errorText={errors.email}
            style={styles.field}
          />

          <LabeledInput
            label="Contrasena"
            placeholder="Tu contrasena"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onPress={() => setShowPassword((v) => !v)}
              />
            }
            error={!!errors.password}
            errorText={errors.password}
            style={styles.field}
          />

          <Button
            mode="text"
            textColor={colors.primary}
            style={styles.forgot}
            onPress={() => setSnack('Funcion de recuperacion pendiente de configurar.')}
          >
            Olvidaste tu contrasena?
          </Button>

          <PrimaryButton onPress={onSubmit} loading={loading} disabled={loading} style={styles.submit}>
            Iniciar sesion
          </PrimaryButton>

          <View style={styles.footer}>
            <Text variant="bodyMedium" style={styles.footerText}>
              No tienes cuenta?
            </Text>
            <Button
              mode="text"
              textColor={colors.primary}
              compact
              onPress={() => navigation.navigate('Register')}
            >
              Registrate
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar visible={!!snack} onDismiss={() => setSnack('')} duration={4000}>
        {snack}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  content: { padding: 24, paddingTop: 32, flexGrow: 1 },
  logo: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, textAlign: 'center', marginTop: 6, marginBottom: 28 },
  field: { marginBottom: 16 },
  forgot: { alignSelf: 'flex-end', marginBottom: 8 },
  submit: { marginTop: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  footerText: { color: colors.textSecondary },
});

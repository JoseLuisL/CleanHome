import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Snackbar, Appbar } from 'react-native-paper';

import LabeledInput from '../items/LabeledInput';
import PrimaryButton from '../items/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors, layout } from '../theme/theme';

/**
 * Pantalla de registro.
 * Valida el formulario y llama a auth.register (crea el usuario y setea
 * el displayName). AuthContext detecta la sesion y el navigator cambia.
 */
export default function RegisterScreen({ navigation }) {
  const { register, mapAuthError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState('');

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Ingresa tu nombre';
    if (!email.trim()) next.email = 'Ingresa tu correo';
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Correo invalido';
    if (!password) next.password = 'Ingresa una contrasena';
    else if (password.length < 6) next.password = 'Minimo 6 caracteres';
    if (confirm !== password) next.confirm = 'Las contrasenas no coinciden';
    setErrors(next);
    console.log("Nombre" + next.name + " Email:" + next.email + "Pass: "+next.password );
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(email, password, name.trim());
      // AuthContext detecta la sesion; no navegamos manualmente.
    } catch (e) {
      setSnack(mapAuthError(e.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Appbar.Header style={styles.header} statusBarHeight={0}>
        <Appbar.BackAction color={colors.textPrimary} onPress={() => navigation.goBack()} />
        <Appbar.Content title="" />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text variant="headlineMedium" style={styles.title}>
            Crea tu cuenta
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Regsitrate para empezar a agendar
          </Text>

          <LabeledInput
            label="Nombre completo"
            placeholder="Paula Ramirez"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            left={<TextInput.Icon icon="account-outline" />}
            error={!!errors.name}
            errorText={errors.name}
            style={styles.field}
          />

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
            placeholder="Minimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
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

          <LabeledInput
            label="Confirmar contrasena"
            placeholder="Repite tu contrasena"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock-check-outline" />}
            error={!!errors.confirm}
            errorText={errors.confirm}
            style={styles.field}
          />

          <PrimaryButton onPress={onSubmit} loading={loading} disabled={loading} style={styles.submit}>
            Crear cuenta
          </PrimaryButton>

          <View style={styles.footer}>
            <Text variant="bodyMedium" style={styles.footerText}>
              Ya tienes cuenta?
            </Text>
            <PrimaryButton mode="text" compact onPress={() => navigation.navigate('Login')}>
              Inicia sesion
            </PrimaryButton>
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
  header: {
    backgroundColor: colors.surface,
    elevation: 0,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  content: {
    padding: 24,
    paddingTop: 8,
    flexGrow: 1,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  title: { fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginTop: 6, marginBottom: 24 },
  field: { marginBottom: 16 },
  submit: { marginTop: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  footerText: { color: colors.textSecondary },
});

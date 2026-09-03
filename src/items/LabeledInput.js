import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { colors } from '../theme/theme';

/**
 * Campo de texto con etiqueta superior (input reutilizable).
 * Soporta las props comunes de teclado/seguridad y un mensaje de error.
 */
export default function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  style,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'sentences',
  autoComplete,
  left,
  right,
  error,
  errorText,
}) {
  return (
    <View style={style}>
      {label ? (
        <Text variant="bodyMedium" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        left={left}
        right={right}
        error={error}
        style={styles.input}
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
        outlineStyle={styles.outline}
      />
      {error && errorText ? (
        <Text variant="bodySmall" style={styles.errorText}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface,
  },
  outline: {
    borderRadius: 12,
  },
  errorText: {
    color: '#DC2626',
    marginTop: 4,
  },
});

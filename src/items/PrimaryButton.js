import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { colors } from '../theme/theme';

/**
 * Boton primario reutilizable (Continuar / accion principal).
 */
export default function PrimaryButton({ children, onPress, disabled, loading, style, mode = 'contained', compact }) {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      compact={compact}
      style={[styles.button, style]}
      contentStyle={compact ? undefined : styles.content}
      labelStyle={styles.label}
      buttonColor={mode === 'contained' ? colors.primary : undefined}
      textColor={mode === 'text' ? colors.primary : undefined}
    >
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
  },
  content: {
    height: 52,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});

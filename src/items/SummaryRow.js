import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme/theme';

/**
 * Fila etiqueta-valor para el resumen de la reserva.
 */
export default function SummaryRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text variant="bodyMedium" style={styles.label}>{label}</Text>
      <Text variant="bodyMedium" style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  label: {
    color: colors.textSecondary,
    flex: 1,
  },
  value: {
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1.4,
    textAlign: 'right',
  },
});

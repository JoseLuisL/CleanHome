import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { colors } from '../theme/theme';

/**
 * Fila de beneficio simple con icono + etiqueta (por que elegirnos).
 */
export default function BenefitRow({ icon, label }) {
  return (
    <View style={styles.row}>
      <Icon source={icon} size={20} color={colors.primary} />
      <Text variant="bodyMedium" style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    marginLeft: 10,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});

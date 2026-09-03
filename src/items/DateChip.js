import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme/theme';

/**
 * Chip de fecha (dia de la semana + numero).
 */
export default function DateChip({ weekday, day, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.weekday, selected && styles.textSelected]}>{weekday}</Text>
      <Text style={[styles.day, selected && styles.textSelected]}>{day}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: 60,
    height: 70,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  weekday: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  day: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  textSelected: {
    color: '#FFFFFF',
  },
});

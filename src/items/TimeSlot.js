import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme/theme';

/**
 * Fila de horario seleccionable.
 * - occupied: franja ya reservada -> atenuada, no seleccionable, "No disponible".
 * - availability === 'low': chip "Pocas disponibilidades".
 */
export default function TimeSlot({ label, availability, selected, occupied, onPress }) {
  return (
    <Pressable
      onPress={occupied ? undefined : onPress}
      disabled={occupied}
      style={[
        styles.row,
        selected && styles.rowSelected,
        occupied && styles.rowOccupied,
      ]}
    >
      <Text
        style={[
          styles.label,
          selected && styles.labelSelected,
          occupied && styles.labelOccupied,
        ]}
      >
        {label}
      </Text>

      {occupied ? (
        <View style={styles.occupiedChip}>
          <Text style={styles.occupiedText}>No disponible</Text>
        </View>
      ) : (
        availability === 'low' && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>Pocas disponibilidades</Text>
          </View>
        )
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  rowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  rowOccupied: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    opacity: 0.6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  labelSelected: {
    color: colors.primaryDark,
  },
  labelOccupied: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  chip: {
    backgroundColor: colors.chipWarning,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: {
    color: colors.chipWarningText,
    fontSize: 11,
    fontWeight: '700',
  },
  occupiedChip: {
    backgroundColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  occupiedText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
});

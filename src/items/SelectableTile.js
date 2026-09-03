import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { colors } from '../theme/theme';

/**
 * Tarjeta seleccionable con icono y etiqueta (espacios a limpiar).
 * Muestra un check cuando esta seleccionada.
 */
export default function SelectableTile({ label, icon, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tile, selected && styles.tileSelected]}
    >
      {selected && (
        <View style={styles.check}>
          <Icon source="check-circle" size={20} color={colors.primary} />
        </View>
      )}
      <Icon source={icon} size={28} color={selected ? colors.primary : colors.textSecondary} />
      <Text
        variant="bodyMedium"
        style={[styles.label, selected && styles.labelSelected]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: 92,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  tileSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  check: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  label: {
    marginTop: 8,
    textAlign: 'center',
    color: colors.textSecondary,
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.primaryDark,
  },
});

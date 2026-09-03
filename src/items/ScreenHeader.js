import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { colors } from '../theme/theme';

/**
 * Encabezado con boton de retroceso y titulo centrado.
 */
export default function ScreenHeader({ title, onBack }) {
  return (
    <Appbar.Header style={styles.header} statusBarHeight={0} mode="center-aligned">
      {onBack ? <Appbar.BackAction color={colors.textPrimary} onPress={onBack} /> : <View style={styles.spacer} />}
      <Appbar.Content
        title={<Text variant="titleMedium" style={styles.title}>{title}</Text>}
      />
      <View style={styles.spacer} />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    elevation: 0,
  },
  title: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  spacer: {
    width: 48,
  },
});

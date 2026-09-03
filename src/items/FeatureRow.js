import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { colors } from '../theme/theme';

/**
 * Fila de caracteristica con icono, titulo y texto (footer de la Home).
 */
export default function FeatureRow({ icon, title, text }) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Icon source={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.body}>
        <Text variant="titleSmall" style={styles.title}>{title}</Text>
        <Text variant="bodySmall" style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  body: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  text: {
    color: colors.textSecondary,
    marginTop: 2,
  },
});

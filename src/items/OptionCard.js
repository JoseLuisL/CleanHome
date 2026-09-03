import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { colors } from '../theme/theme';

/**
 * Tarjeta grande de opcion (tipo de limpieza) con icono, titulo,
 * descripcion, badge opcional y duracion. Radio a la derecha.
 */
export default function OptionCard({ title, description, icon, badge, durationLabel, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.card, selected && styles.cardSelected]}>
      <View style={styles.iconWrap}>
        <Icon source={icon} size={26} color={colors.primary} />
      </View>

      <View style={styles.body}>
        <Text variant="titleMedium" style={styles.title}>{title}</Text>
        <Text variant="bodySmall" style={styles.description}>{description}</Text>

        <View style={styles.footer}>
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : (
            <View />
          )}
          {durationLabel ? (
            <Text variant="bodySmall" style={styles.duration}>{durationLabel}</Text>
          ) : null}
        </View>
      </View>

      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <Icon source="check" size={14} color="#FFFFFF" />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 14,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
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
  description: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  badge: {
    backgroundColor: colors.successLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  duration: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  radioSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});

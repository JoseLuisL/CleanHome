import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Icon } from 'react-native-paper';

import StepLayout from '../items/StepLayout';
import SelectableTile from '../items/SelectableTile';
import { getSpaces } from '../services/catalogService';
import { calculateQuote, formatSoles } from '../services/pricingService';
import { useBooking } from '../context/BookingContext';
import { colors } from '../theme/theme';

/**
 * Pantalla 2 - Detalles del trabajo.
 * El usuario selecciona uno o mas espacios a limpiar (grid de 2 columnas).
 */
export default function JobDetailsScreen({ navigation }) {
  const [spaces, setSpaces] = useState([]);
  const { booking, toggleSpace } = useBooking();

  useEffect(() => {
    getSpaces().then(setSpaces);
  }, []);

  const rows = [];
  for (let i = 0; i < spaces.length; i += 2) {
    rows.push(spaces.slice(i, i + 2));
  }

  const count = booking.spaces.length;

  // Subtotal de los espacios seleccionados (sin multiplicador; el tipo de
  // limpieza se elige en el paso siguiente).
  const { subtotal } = calculateQuote(spaces, booking.spaces, null);

  return (
    <StepLayout
      title="Detalles del trabajo"
      step={2}
      onBack={() => navigation.goBack()}
      onButtonPress={() => navigation.navigate('CleaningType')}
      buttonDisabled={count === 0}
    >
      <Text variant="titleLarge" style={styles.title}>Que espacios necesitas limpiar?</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>Selecciona uno o mas espacios</Text>

      <View style={styles.notice}>
        <Icon source="office-building-outline" size={18} color={colors.primary} />
        <Text variant="bodySmall" style={styles.noticeText}>
          Por ahora el servicio esta disponible solo para departamentos.
        </Text>
      </View>

      {rows.map((row, idx) => (
        <View key={idx} style={styles.row}>
          {row.map((space) => (
            <SelectableTile
              key={space.id}
              label={space.label}
              icon={space.icon}
              selected={booking.spaces.includes(space.id)}
              onPress={() => toggleSpace(space.id)}
            />
          ))}
          {row.length === 1 && <View style={styles.filler} />}
        </View>
      ))}

      <View style={styles.summary}>
        <Text variant="bodyMedium" style={styles.counter}>{count} seleccionados</Text>
        <View style={styles.subtotalRow}>
          <Text variant="bodyMedium" style={styles.subtotalLabel}>Subtotal</Text>
          <Text variant="titleMedium" style={styles.subtotalValue}>{formatSoles(subtotal)}</Text>
        </View>
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginTop: 4, marginBottom: 12 },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  noticeText: { color: colors.primaryDark, marginLeft: 8, flex: 1 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  filler: { flex: 1 },
  summary: { marginTop: 10 },
  counter: { color: colors.textSecondary, fontWeight: '600' },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  subtotalLabel: { color: colors.textSecondary, fontWeight: '600' },
  subtotalValue: { color: colors.primary, fontWeight: '700' },
});

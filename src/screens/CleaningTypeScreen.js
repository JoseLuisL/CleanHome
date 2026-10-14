import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Icon } from 'react-native-paper';

import StepLayout from '../items/StepLayout';
import OptionCard from '../items/OptionCard';
import { getCleaningTypes, getSpaces } from '../services/catalogService';
import { calculateQuote, formatSoles } from '../services/pricingService';
import { useBooking } from '../context/BookingContext';
import { colors } from '../theme/theme';

/**
 * Pantalla 3 - Tipo de limpieza.
 * Seleccion unica: Limpieza Express o Limpieza Profunda.
 * Aqui se muestra el costo total: subtotal de los espacios seleccionados
 * multiplicado por el factor del tipo de limpieza elegido.
 */
export default function CleaningTypeScreen({ navigation }) {
  const [types, setTypes] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const { booking, update } = useBooking();

  useEffect(() => {
    getCleaningTypes().then(setTypes);
    getSpaces().then(setSpaces);
  }, []);

  const selectedType = types.find((t) => t.id === booking.cleaningType) || null;
  const { subtotal, total } = calculateQuote(spaces, booking.spaces, selectedType);

  return (
    <StepLayout
      title="Tipo de limpieza"
      step={3}
      onBack={() => navigation.goBack()}
      onButtonPress={() => navigation.navigate('Schedule')}
      buttonDisabled={!booking.cleaningType}
    >
      <Text variant="titleLarge" style={styles.title}>Que tipo de limpieza necesitas?</Text>

      <View style={styles.list}>
        {types.map((t) => (
          <OptionCard
            key={t.id}
            title={t.title}
            description={t.description}
            icon={t.icon}
            badge={t.badge}
            durationLabel={t.durationLabel}
            selected={booking.cleaningType === t.id}
            onPress={() => update({ cleaningType: t.id })}
          />
        ))}
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text variant="bodyMedium" style={styles.summaryLabel}>Subtotal espacios</Text>
          <Text variant="bodyMedium" style={styles.summaryValue}>{formatSoles(subtotal)}</Text>
        </View>
        {selectedType && (
          <View style={styles.summaryRow}>
            <Text variant="bodyMedium" style={styles.summaryLabel}>{selectedType.title}</Text>
            <Text variant="bodyMedium" style={styles.summaryValue}>
              x{(Number(selectedType.priceMultiplier) || 1).toFixed(2)}
            </Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text variant="titleMedium" style={styles.totalLabel}>Total</Text>
          <Text variant="titleLarge" style={styles.totalValue}>{formatSoles(total)}</Text>
        </View>
        {!selectedType && (
          <Text variant="bodySmall" style={styles.hint}>
            Selecciona un tipo de limpieza para ver el costo total.
          </Text>
        )}
      </View>

      <View style={styles.note}>
        <Icon source="shield-check-outline" size={18} color={colors.primary} />
        <Text variant="bodySmall" style={styles.noteText}>
          Incluye productos y equipos de limpieza profesionales.
        </Text>
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: '700', color: colors.textPrimary, marginBottom: 18 },
  list: { marginTop: 4 },
  summary: {
    marginTop: 18,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: { color: colors.textSecondary },
  summaryValue: { color: colors.textPrimary, fontWeight: '600' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: { color: colors.textPrimary, fontWeight: '700' },
  totalValue: { color: colors.primary, fontWeight: '700' },
  hint: { color: colors.textSecondary, marginTop: 8 },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  noteText: { color: colors.primaryDark, marginLeft: 8, flex: 1 },
});

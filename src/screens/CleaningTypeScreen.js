import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Icon } from 'react-native-paper';

import StepLayout from '../items/StepLayout';
import OptionCard from '../items/OptionCard';
import { getCleaningTypes } from '../services/catalogService';
import { useBooking } from '../context/BookingContext';
import { colors } from '../theme/theme';

/**
 * Pantalla 3 - Tipo de limpieza.
 * Seleccion unica: Limpieza Express o Limpieza Profunda.
 */
export default function CleaningTypeScreen({ navigation }) {
  const [types, setTypes] = useState([]);
  const { booking, update } = useBooking();

  useEffect(() => {
    getCleaningTypes().then(setTypes);
  }, []);

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
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  noteText: { color: colors.primaryDark, marginLeft: 8, flex: 1 },
});

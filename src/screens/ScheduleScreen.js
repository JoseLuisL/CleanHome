import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';

import StepLayout from '../items/StepLayout';
import DateChip from '../items/DateChip';
import TimeSlot from '../items/TimeSlot';
import { getDates, getTimeSlots } from '../services/catalogService';
import { getAvailability } from '../services/bookingService';
import { useBooking } from '../context/BookingContext';
import { colors } from '../theme/theme';

/**
 * Pantalla 4 - Fecha y horario.
 * Fechas dinamicas (proximos dias) + franjas horarias cuya disponibilidad
 * se consulta al elegir la fecha (Opcion A: simulada y determinista).
 */
export default function ScheduleScreen({ navigation }) {
  const [dates, setDates] = useState([]);
  const [slots, setSlots] = useState([]);
  const [occupied, setOccupied] = useState([]); // ids de franjas ocupadas
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { booking, update } = useBooking();

  // Carga inicial de fechas y franjas base.
  useEffect(() => {
    getDates().then(setDates);
    getTimeSlots().then(setSlots);
  }, []);

  // Cada vez que cambia la fecha elegida, recarga la disponibilidad.
  useEffect(() => {
    if (!booking.date || slots.length === 0) {
      setOccupied([]);
      return;
    }

    let mounted = true;
    setLoadingSlots(true);

    getAvailability(booking.date, slots.map((s) => s.id))
      .then((occupiedIds) => {
        if (!mounted) return;
        setOccupied(occupiedIds);
        // Si la franja ya elegida quedo ocupada en esta fecha, la limpiamos.
        if (booking.timeSlot && occupiedIds.includes(booking.timeSlot)) {
          update({ timeSlot: null });
        }
      })
      .finally(() => {
        if (mounted) setLoadingSlots(false);
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.date, slots]);

  const selectDate = (id) => {
    // Al cambiar de fecha reseteamos la franja para forzar nueva eleccion.
    update({ date: id, timeSlot: null });
  };

  return (
    <StepLayout
      title="Fecha y horario"
      step={4}
      onBack={() => navigation.goBack()}
      onButtonPress={() => navigation.navigate('Location')}
      buttonDisabled={!booking.date || !booking.timeSlot}
    >
      <Text variant="titleLarge" style={styles.title}>Elige la fecha</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dates}
      >
        {dates.map((d) => (
          <DateChip
            key={d.id}
            weekday={d.weekday}
            day={d.day}
            selected={booking.date === d.id}
            onPress={() => selectDate(d.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.slotsHeader}>
        <Text variant="titleLarge" style={styles.title}>Elige el horario</Text>
        {loadingSlots && <ActivityIndicator size={18} color={colors.primary} />}
      </View>

      {!booking.date ? (
        <Text variant="bodyMedium" style={styles.hint}>
          Selecciona una fecha para ver los horarios disponibles.
        </Text>
      ) : (
        <View>
          {slots.map((s) => (
            <TimeSlot
              key={s.id}
              label={s.label}
              availability={s.availability}
              occupied={occupied.includes(s.id)}
              selected={booking.timeSlot === s.id}
              onPress={() => update({ timeSlot: s.id })}
            />
          ))}
        </View>
      )}
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
  dates: { paddingBottom: 4 },
  slotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  hint: { color: colors.textSecondary, marginTop: 4 },
});

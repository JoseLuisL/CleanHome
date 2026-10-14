import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Icon, ActivityIndicator } from 'react-native-paper';

import ScreenHeader from '../items/ScreenHeader';
import { getUserBookings } from '../services/bookingService';
import { getTimeSlots } from '../services/catalogService';
import { formatSoles } from '../services/pricingService';
import { useAuth } from '../context/AuthContext';
import { colors, layout } from '../theme/theme';

const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/** Convierte una fecha ISO "YYYY-MM-DD" en "Martes, 5 de septiembre". */
function formatDate(iso) {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${WEEKDAYS[date.getDay()]}, ${d} de ${MONTHS[m - 1]}`;
}

/**
 * Pantalla de historico de reservas del usuario.
 * Lee las reservas de Firestore (ya ordenadas en el service) y muestra
 * cada una de forma simplificada: dia y hora, precio y codigo de reserva.
 */
export default function BookingHistoryScreen({ navigation }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [slotLabels, setSlotLabels] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const [list, slots] = await Promise.all([
      getUserBookings(user?.uid),
      getTimeSlots(),
    ]);
    const labels = {};
    slots.forEach((s) => {
      labels[s.id] = s.label;
    });
    setSlotLabels(labels);
    setBookings(list);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenHeader title="Historico de reservas" onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.center}>
          <Icon source="calendar-blank-outline" size={56} color={colors.textSecondary} />
          <Text variant="titleMedium" style={styles.emptyTitle}>Aun no tienes reservas</Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Cuando agendes un servicio, aparecera aqui.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {bookings.map((b) => (
            <View key={b.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <Text variant="titleMedium" style={styles.date}>{formatDate(b.date)}</Text>
                <Text variant="bodyMedium" style={styles.time}>
                  {slotLabels[b.timeSlot] || b.timeSlot || '-'}
                </Text>
                <Text variant="bodySmall" style={styles.code}>{b.bookingNumber}</Text>
              </View>
              <Text variant="titleMedium" style={styles.price}>
                {formatSoles(b.total)}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  emptyTitle: { fontWeight: '700', color: colors.textPrimary, marginTop: 12 },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 6 },
  content: {
    padding: 20,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLeft: { flex: 1, marginRight: 12 },
  date: { fontWeight: '700', color: colors.textPrimary },
  time: { color: colors.textSecondary, marginTop: 2 },
  code: { color: colors.primary, fontWeight: '600', marginTop: 6 },
  price: { fontWeight: '700', color: colors.primary },
});

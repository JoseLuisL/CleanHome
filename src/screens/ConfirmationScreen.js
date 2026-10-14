import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Icon, ActivityIndicator } from 'react-native-paper';

import ScreenHeader from '../items/ScreenHeader';
import Stepper from '../items/Stepper';
import PrimaryButton from '../items/PrimaryButton';
import SummaryRow from '../items/SummaryRow';
import { createBooking } from '../services/bookingService';
import {
  getSpaces,
  getCleaningTypes,
  getDates,
  getTimeSlots,
  getDistricts,
} from '../services/catalogService';
import { calculateQuote, formatSoles } from '../services/pricingService';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { colors, layout } from '../theme/theme';


/**
 * Pantalla 6 - Confirmacion.
 * Resuelve las etiquetas legibles del resumen a partir de los ids del
 * contexto, crea la reserva y muestra el numero de reserva generado.
 */
export default function ConfirmationScreen({ navigation }) {
  const { booking, reset } = useBooking();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [labels, setLabels] = useState({ spaces: '', type: '', date: '', time: '', district: '' });
  const [quote, setQuote] = useState({ lineItems: [], subtotal: 0, multiplier: 1, total: 0 });

  useEffect(() => {
    let mounted = true;

    async function build() {
      const [spaces, types, dates, slots, districts] = await Promise.all([
        getSpaces(),
        getCleaningTypes(),
        getDates(),
        getTimeSlots(),
        getDistricts(),
      ]);

      const spacesLabel = spaces
        .filter((s) => booking.spaces.includes(s.id))
        .map((s) => s.label)
        .join(', ');
      const type = types.find((t) => t.id === booking.cleaningType);
      const date = dates.find((d) => d.id === booking.date);
      const slot = slots.find((s) => s.id === booking.timeSlot);
      const district = districts.find((d) => d.id === booking.district);

      // Las fechas dinamicas ya traen la etiqueta completa en espanol.
      const dateLabel = date?.fullLabel || '-';

      // Cotizacion final: espacios seleccionados * multiplicador del tipo.
      const q = calculateQuote(spaces, booking.spaces, type);

      if (!mounted) return;
      setLabels({
        spaces: spacesLabel || '-',
        type: type ? type.title : '-',
        date: dateLabel,
        time: slot ? slot.label : '-',
        district: district ? district.label : '-',
      });
      setQuote(q);

      // Guardamos el total con la reserva, asociada al usuario autenticado.
      try {
        const res = await createBooking({ ...booking, total: q.total }, user?.uid || null);
        if (!mounted) return;
        setResult(res);
      } catch (e) {
        if (!mounted) return;
        // Franja ya reservada u otro error al confirmar.
        setError(
          e.code === 'slot-taken'
            ? 'La franja horaria que elegiste acaba de ser reservada. Vuelve al paso de horario y elige otra.'
            : 'No se pudo confirmar tu reserva. Intenta nuevamente.'
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    build();
    return () => {
      mounted = false;
    };
  }, []);

  const goHome = () => {
    reset();
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenHeader title="Confirmacion" onBack={() => navigation.goBack()} />
      <View style={styles.stepperWrap}>
        <Stepper total={6} current={6} />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Confirmando tu reserva...</Text>
        </View>
      ) : error ? (
        <View style={styles.loading}>
          <Icon source="alert-circle-outline" size={64} color="#DC2626" />
          <Text variant="titleMedium" style={styles.errorTitle}>No se pudo confirmar</Text>
          <Text variant="bodyMedium" style={styles.errorText}>{error}</Text>
          <PrimaryButton
            style={styles.errorBtn}
            onPress={() => navigation.navigate('Schedule')}
          >
            Elegir otro horario
          </PrimaryButton>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.successIcon}>
            <Icon source="check-circle" size={72} color={colors.success} />
          </View>
          <Text variant="headlineSmall" style={styles.successTitle}>
            Tu reserva ha sido confirmada!
          </Text>
          <Text variant="bodyMedium" style={styles.successText}>
            Hemos enviado los detalles a tu correo y WhatsApp.
          </Text>

          <View style={styles.card}>
            <Text variant="titleMedium" style={styles.cardTitle}>Resumen de tu reserva</Text>
            <SummaryRow label="Tipo de vivienda" value="Departamento" />
            <SummaryRow label="Servicios" value={labels.spaces} />
            <SummaryRow label="Tipo de limpieza" value={labels.type} />
            <SummaryRow label="Fecha" value={labels.date} />
            <SummaryRow label="Horario" value={labels.time} />
            <SummaryRow label="Distrito" value={labels.district} />
            <SummaryRow label="Direccion" value={booking.address || '-'} />
            {booking.reference ? (
              <SummaryRow label="Referencia" value={booking.reference} />
            ) : null}
            <SummaryRow label="Contacto" value={booking.phone || '-'} />
          </View>

          <View style={styles.card}>
            <Text variant="titleMedium" style={styles.cardTitle}>Desglose de costo</Text>
            {quote.lineItems.map((item) => (
              <SummaryRow key={item.id} label={item.label} value={formatSoles(item.price)} />
            ))}

            <View style={styles.costDivider} />

            <SummaryRow label="Subtotal" value={formatSoles(quote.subtotal)} />
            {quote.multiplier !== 1 && (
              <SummaryRow
                label={`${labels.type} (x${quote.multiplier})`}
                value={formatSoles(quote.total - quote.subtotal)}
              />
            )}

            <View style={styles.totalRow}>
              <Text variant="titleMedium" style={styles.totalLabel}>Total</Text>
              <Text variant="titleLarge" style={styles.totalValue}>{formatSoles(quote.total)}</Text>
            </View>
          </View>

          <View style={styles.bookingBox}>
            <Text variant="bodySmall" style={styles.bookingLabel}>Numero de reserva</Text>
            <Text variant="titleMedium" style={styles.bookingNumber}>
              {result?.bookingNumber}
            </Text>
          </View>

          <PrimaryButton style={styles.action} onPress={goHome}>
            Volver al inicio
          </PrimaryButton>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  stepperWrap: {
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  loadingText: { color: colors.textSecondary, marginTop: 12 },
  errorTitle: { fontWeight: '700', color: colors.textPrimary, marginTop: 12 },
  errorText: { color: colors.textSecondary, textAlign: 'center', marginTop: 8 },
  errorBtn: { marginTop: 20, alignSelf: 'stretch' },
  content: {
    padding: 20,
    paddingBottom: 24,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  successIcon: { alignItems: 'center', marginTop: 8, marginBottom: 12 },
  successTitle: { fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  successText: { color: colors.textSecondary, textAlign: 'center', marginTop: 6, marginBottom: 22 },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
  costDivider: { height: 1, backgroundColor: colors.border, marginBottom: 12 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: { fontWeight: '700', color: colors.textPrimary },
  totalValue: { fontWeight: '700', color: colors.primary },
  bookingBox: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  bookingLabel: { color: colors.textSecondary },
  bookingNumber: { fontWeight: '700', color: colors.primary, marginTop: 2 },
  action: { marginBottom: 8 },
  actionText: {},
});

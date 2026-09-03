import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import StepLayout from '../items/StepLayout';
import LabeledInput from '../items/LabeledInput';
import { useBooking } from '../context/BookingContext';
import { colors } from '../theme/theme';

/**
 * Pantalla 5 - Ubicacion y contacto.
 * Formulario simple: direccion, referencia (opcional) y numero de contacto.
 * La direccion y el telefono son obligatorios para continuar.
 */
export default function LocationScreen({ navigation }) {
  const { booking, update } = useBooking();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!booking.address.trim()) next.address = 'Ingresa tu direccion';
    if (!booking.phone.trim()) next.phone = 'Ingresa un numero de contacto';
    else if (!/^\+?[\d\s-]{6,15}$/.test(booking.phone.trim())) {
      next.phone = 'Numero de contacto invalido';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onContinue = () => {
    if (!validate()) return;
    navigation.navigate('Confirmation');
  };

  return (
    <StepLayout
      title="Ubicacion"
      step={5}
      onBack={() => navigation.goBack()}
      onButtonPress={onContinue}
    >
      <Text variant="titleLarge" style={styles.title}>Direccion y contacto</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Indica donde realizaremos el servicio y como contactarte.
      </Text>

      <LabeledInput
        label="Direccion"
        placeholder="Av. Los Sauces 123, Dpto 502, San Isidro"
        value={booking.address}
        onChangeText={(text) => update({ address: text })}
        multiline
        left={<TextInput.Icon icon="map-marker-outline" />}
        error={!!errors.address}
        errorText={errors.address}
        style={styles.field}
      />

      <LabeledInput
        label="Referencia (opcional)"
        placeholder="Edificio blanco, ingresar por la puerta principal."
        value={booking.reference}
        onChangeText={(text) => update({ reference: text })}
        multiline
        left={<TextInput.Icon icon="information-outline" />}
        style={styles.field}
      />

      <LabeledInput
        label="Numero de contacto"
        placeholder="999 888 777"
        value={booking.phone}
        onChangeText={(text) => update({ phone: text })}
        keyboardType="phone-pad"
        left={<TextInput.Icon icon="phone-outline" />}
        error={!!errors.phone}
        errorText={errors.phone}
        style={styles.field}
      />
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: '700', color: colors.textPrimary, marginBottom: 6 },
  subtitle: { color: colors.textSecondary, marginBottom: 20 },
  field: { marginBottom: 16 },
});

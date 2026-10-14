import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Pressable, FlatList } from 'react-native';
import { Text, TextInput, Modal, Portal, Searchbar, Icon, Divider } from 'react-native-paper';

import StepLayout from '../items/StepLayout';
import LabeledInput from '../items/LabeledInput';
import { getDistricts } from '../services/catalogService';
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
  const [districts, setDistricts] = useState([]);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getDistricts().then(setDistricts);
  }, []);

  const selectedDistrict = districts.find((d) => d.id === booking.district) || null;

  // Lista filtrada por el texto del buscador (ignora acentos y mayusculas).
  const filteredDistricts = useMemo(() => {
    const normalize = (s) =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const q = normalize(search.trim());
    if (!q) return districts;
    return districts.filter((d) => normalize(d.label).includes(q));
  }, [districts, search]);

  const openDistrictModal = () => {
    setSearch('');
    setDistrictModalVisible(true);
  };

  const selectDistrict = (id) => {
    update({ district: id });
    setDistrictModalVisible(false);
    setErrors((prev) => ({ ...prev, district: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!booking.district) next.district = 'Selecciona tu distrito';
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

      <View style={styles.field}>
        <Text variant="bodyMedium" style={styles.label}>Distrito</Text>
        <Pressable
          onPress={openDistrictModal}
          style={[styles.selector, errors.district && styles.selectorError]}
        >
          <Icon source="city-variant-outline" size={20} color={colors.textSecondary} />
          <Text
            style={[styles.selectorText, !selectedDistrict && styles.selectorPlaceholder]}
            numberOfLines={1}
          >
            {selectedDistrict ? selectedDistrict.label : 'Selecciona tu distrito'}
          </Text>
          <Icon source="chevron-down" size={22} color={colors.textSecondary} />
        </Pressable>
        {errors.district ? (
          <Text variant="bodySmall" style={styles.errorText}>{errors.district}</Text>
        ) : null}
      </View>

      <Portal>
        <Modal
          visible={districtModalVisible}
          onDismiss={() => setDistrictModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <View style={styles.modalHeader}>
            <Text variant="titleMedium" style={styles.modalTitle}>Selecciona tu distrito</Text>
            <Pressable onPress={() => setDistrictModalVisible(false)} hitSlop={8}>
              <Icon source="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Searchbar
            placeholder="Buscar distrito"
            value={search}
            onChangeText={setSearch}
            style={styles.searchbar}
            inputStyle={styles.searchInput}
          />

          <FlatList
            data={filteredDistricts}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            ItemSeparatorComponent={Divider}
            ListEmptyComponent={
              <Text style={styles.empty}>No se encontraron distritos.</Text>
            }
            renderItem={({ item }) => {
              const isSelected = booking.district === item.id;
              return (
                <Pressable
                  onPress={() => selectDistrict(item.id)}
                  style={[styles.option, isSelected && styles.optionSelected]}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Icon source="check" size={20} color={colors.primary} />
                  )}
                </Pressable>
              );
            }}
          />
        </Modal>
      </Portal>

      <LabeledInput
        label="Direccion"
        placeholder="Av. Los Sauces 123, Dpto 502"
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
  label: {
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 56,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  selectorError: {
    borderColor: '#DC2626',
  },
  selectorText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
  },
  selectorPlaceholder: {
    color: colors.textSecondary,
  },
  modal: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 8,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  modalTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  searchbar: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  searchInput: {
    fontSize: 15,
  },
  list: {
    flexGrow: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  optionSelected: {
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 24,
  },
  errorText: {
    color: '#DC2626',
    marginTop: 4,
  },
});

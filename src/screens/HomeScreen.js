import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Appbar, Icon, Card, ActivityIndicator, Snackbar, Menu } from 'react-native-paper';

import PrimaryButton from '../items/PrimaryButton';
import BenefitRow from '../items/BenefitRow';
import FeatureRow from '../items/FeatureRow';
import { getBenefits, getHomeFeatures } from '../services/catalogService';
import { getCurrentLocation, mapLocationError } from '../services/locationService';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { colors } from '../theme/theme';

/**
 * Pantalla 1 - Inicio.
 * Saludo, tarjeta principal "Limpieza del hogar", motivos para elegirnos
 * y footer de caracteristicas. El boton "Agendar ahora" inicia el flujo.
 */
export default function HomeScreen({ navigation }) {
  const [benefits, setBenefits] = useState([]);
  const [features, setFeatures] = useState([]);
  const [locationLabel, setLocationLabel] = useState('Mi ubicacion');
  const [locating, setLocating] = useState(false);
  const [snack, setSnack] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const { user, logout } = useAuth();
  const { update } = useBooking();

  const firstName = user?.displayName?.split(' ')[0] || 'Paula';

  useEffect(() => {
    getBenefits().then(setBenefits);
    getHomeFeatures().then(setFeatures);
  }, []);

  // Obtiene la ubicacion del cliente, la muestra en el header (ciudad/primera
  // linea) y la guarda en el contexto para el flujo de reserva.
  const detectLocation = async () => {
    setLocating(true);
    try {
      const { address, coords } = await getCurrentLocation();
      if (address) {
        update({ address });
        // Mostramos una linea corta en el header (ciudad o primera linea).
        const short = address.split('\n').pop();
        setLocationLabel(short || 'Mi ubicacion');
      } else {
        setLocationLabel(
          `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`
        );
      }
    } catch (e) {
      setSnack(mapLocationError(e.code));
    } finally {
      setLocating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Appbar.Header style={styles.header} statusBarHeight={0}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="menu"
              color={colors.textPrimary}
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            leadingIcon="history"
            title="Historico de reservas"
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('BookingHistory');
            }}
          />
          <Menu.Item
            leadingIcon="logout"
            title="Cerrar sesion"
            onPress={() => {
              setMenuVisible(false);
              logout();
            }}
          />
        </Menu>
        <Pressable style={styles.location} onPress={detectLocation} disabled={locating}>
          {locating ? (
            <ActivityIndicator size={16} color={colors.primary} />
          ) : (
            <Icon source="map-marker-outline" size={18} color={colors.primary} />
          )}
          <Text style={styles.locationText} numberOfLines={1}>{locationLabel}</Text>
          <Icon source="chevron-down" size={18} color={colors.textSecondary} />
        </Pressable>
        <View style={styles.headerSpacer} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="headlineSmall" style={styles.greeting}>Hola, {firstName}!</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Que servicio necesitas hoy?</Text>

        <Card style={styles.mainCard} mode="contained">
          <View style={styles.heroImage}>
            <Icon source="home-heart" size={64} color={colors.primary} />
          </View>
          <View style={styles.mainCardBody}>
            <Text variant="titleLarge" style={styles.mainCardTitle}>Limpieza del hogar</Text>
            <Text variant="bodyMedium" style={styles.mainCardText}>
              Deja tu casa impecable, nosotros nos encargamos.
            </Text>
            <PrimaryButton style={styles.cta} onPress={() => navigation.navigate('JobDetails')}>
              Agendar ahora
            </PrimaryButton>
          </View>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>Por que elegirnos?</Text>
        {benefits.map((b) => (
          <BenefitRow key={b.id} icon={b.icon} label={b.label} />
        ))}

        <View style={styles.divider} />

        {features.map((f) => (
          <FeatureRow key={f.id} icon={f.icon} title={f.title} text={f.text} />
        ))}
      </ScrollView>

      <Snackbar visible={!!snack} onDismiss={() => setSnack('')} duration={4000}>
        {snack}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.background, elevation: 0, justifyContent: 'space-between' },
  headerSpacer: { width: 48 },
  location: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 8 },
  locationText: { fontWeight: '700', color: colors.textPrimary, marginHorizontal: 4, flexShrink: 1 },
  content: { padding: 20, paddingBottom: 32 },
  greeting: { fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginTop: 4, marginBottom: 20 },
  mainCard: { backgroundColor: colors.surface, borderRadius: 20, overflow: 'hidden', marginBottom: 24 },
  heroImage: {
    height: 150,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCardBody: { padding: 18 },
  mainCardTitle: { fontWeight: '700', color: colors.textPrimary },
  mainCardText: { color: colors.textSecondary, marginTop: 4, marginBottom: 16 },
  cta: {},
  sectionTitle: { fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 18 },
});

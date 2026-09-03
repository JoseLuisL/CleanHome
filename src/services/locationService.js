/**
 * Servicio de ubicacion.
 * Aisla expo-location para que las pantallas no dependan del SDK directamente.
 * Flujo: pedir permiso -> obtener coordenadas -> geocoding inverso (direccion).
 */
import * as Location from 'expo-location';

/**
 * Error de dominio con un codigo estable para que la UI decida el mensaje.
 * codes: 'permission-denied' | 'services-disabled' | 'unavailable'
 */
export class LocationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'LocationError';
    this.code = code;
  }
}

/**
 * Da formato a una direccion de reverseGeocodeAsync en dos lineas:
 * "Av. Ejemplo 123, Distrito\nCiudad, Region". Ignora campos vacios.
 *
 * El nombre de la via (avenida/calle) puede venir en `street` o, si el
 * dispositivo no lo separa, en `name`. Priorizamos `street` y usamos `name`
 * como respaldo para que siempre se vea la avenida.
 * @param {import('expo-location').LocationGeocodedAddress} place
 */
function formatAddress(place) {
  if (!place) return '';

  // Nombre de la via: street preferido; si no, name (evitando duplicar).
  const roadName = place.street || place.name || '';
  const number = place.streetNumber || '';
  const street = [roadName, number].filter(Boolean).join(' ').trim();

  // Zona: distrito o subregion.
  const zone = place.district || place.subregion || '';

  // Evita repetir el nombre de la via si ya quedo incluido en la zona.
  const line1 = [street, zone && zone !== street ? zone : '']
    .filter(Boolean)
    .join(', ');

  const line2 = [place.city, place.region].filter(Boolean).join(', ');

  const formatted = [line1, line2].filter(Boolean).join('\n');

  // Ultimo respaldo: la direccion completa que a veces trae el SO.
  return formatted || place.formattedAddress || '';
}

/**
 * Obtiene la ubicacion actual del usuario ya convertida a direccion legible.
 * @returns {Promise<{ coords: { latitude: number, longitude: number }, address: string, raw: object }>}
 * @throws {LocationError}
 */
export async function getCurrentLocation() {
  // 1. Verificar que el GPS/servicios de ubicacion esten activos.
  const enabled = await Location.hasServicesEnabledAsync();
  if (!enabled) {
    throw new LocationError(
      'services-disabled',
      'Los servicios de ubicacion estan desactivados.'
    );
  }

  // 2. Pedir permiso al usuario.
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new LocationError(
      'permission-denied',
      'Permiso de ubicacion denegado.'
    );
  }

  // 3. Obtener coordenadas con alta precision para resolver el nivel de calle.
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  const { latitude, longitude } = position.coords;

  // 4. Geocoding inverso: coordenadas -> direccion (servicio del SO, sin API key).
  let address = '';
  let raw = null;
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    raw = results?.[0] || null;
    // Log temporal: muestra los campos que devuelve tu dispositivo.
    console.log('[location] reverseGeocode:', JSON.stringify(raw));
    address = formatAddress(raw);
  } catch (e) {
    // Si el geocoding falla, devolvemos coordenadas y address vacio;
    // la pantalla puede decidir mostrar solo el punto o pedir texto manual.
    address = '';
  }

  return { coords: { latitude, longitude }, address, raw };
}

/**
 * Traduce el codigo de LocationError a un mensaje para el usuario.
 */
export function mapLocationError(code) {
  const messages = {
    'permission-denied':
      'No diste permiso de ubicacion. Puedes escribir tu direccion manualmente.',
    'services-disabled':
      'Activa el GPS/ubicacion de tu dispositivo e intenta de nuevo.',
    'unavailable': 'No se pudo obtener la ubicacion. Intenta nuevamente.',
  };
  return messages[code] || 'No se pudo obtener la ubicacion. Intenta nuevamente.';
}

export default { getCurrentLocation, mapLocationError, LocationError };

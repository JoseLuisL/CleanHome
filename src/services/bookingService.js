/**
 * Servicio de reservas.
 * Crea la reserva en Firestore (coleccion homeBookings) y consulta la
 * disponibilidad real de franjas por fecha.
 */
import {
  addBooking,
  fetchOccupiedSlots,
  fetchUserBookings,
} from '../firebase/bookingRemoteService';

const pad = (n) => String(n).padStart(4, '0');

/** Error de dominio para franja ya reservada (concurrencia - nivel simple). */
export class SlotTakenError extends Error {
  constructor(message = 'La franja horaria ya fue reservada. Elige otra.') {
    super(message);
    this.name = 'SlotTakenError';
    this.code = 'slot-taken';
  }
}

/**
 * Devuelve los ids de franjas ocupadas para una fecha (real, desde Firestore).
 * Fallback optimista: si la lectura falla, devuelve [] (todas disponibles)
 * para no trabar el flujo.
 *
 * @param {string} dateId - id/ISO de la fecha elegida
 * @param {string[]} _slotIds - ids de franjas del catalogo (no requerido aqui)
 * @returns {Promise<string[]>} ids de franjas ocupadas
 */
export async function getAvailability(dateId, _slotIds = []) {
  if (!dateId) return [];
  try {
    return await fetchOccupiedSlots(dateId);
  } catch (e) {
    console.log('[getAvailability] fallback optimista:', e.code || e.message);
    return [];
  }
}

/**
 * Crea una reserva en Firestore.
 * Concurrencia nivel simple: antes de escribir, relee las franjas ocupadas
 * de la fecha y aborta si la elegida ya fue tomada.
 *
 * @param {Object} booking - datos del flujo (spaces, cleaningType, date, timeSlot, address, phone, total...)
 * @param {string|null} userId - id del usuario autenticado (o null)
 * @returns {Promise<{ bookingNumber: string, status: string, id: string, booking: Object }>}
 * @throws {SlotTakenError}
 */
export async function createBooking(booking, userId = null) {
  // Nivel simple: comprobamos disponibilidad justo antes de reservar.
  if (booking.date && booking.timeSlot) {
    const occupied = await fetchOccupiedSlots(booking.date);
    if (occupied.includes(booking.timeSlot)) {
      throw new SlotTakenError();
    }
  }

  const seq = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  const bookingNumber = `#LH-${year}-${pad(seq)}`;

  const id = await addBooking({
    ...booking,
    userId,
    bookingNumber,
    status: 'confirmed',
  });

  return { bookingNumber, status: 'confirmed', id, booking };
}

/**
 * Devuelve las reservas del usuario, ordenadas de mas reciente a mas antigua
 * (orden en el cliente para no requerir indice de Firestore).
 * Fallback: si la lectura falla, devuelve [].
 * @param {string} userId
 * @returns {Promise<Array<Object>>}
 */
export async function getUserBookings(userId) {
  if (!userId) return [];
  try {
    const bookings = await fetchUserBookings(userId);
    return bookings.sort((a, b) => {
      const ta = a.createdAt?.seconds ?? 0;
      const tb = b.createdAt?.seconds ?? 0;
      return tb - ta;
    });
  } catch (e) {
    console.log('[getUserBookings] fallback:', e.code || e.message);
    return [];
  }
}

export default { createBooking, getAvailability, getUserBookings, SlotTakenError };

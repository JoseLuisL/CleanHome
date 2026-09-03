/**
 * Acceso a reservas en Cloud Firestore (coleccion homeBookings).
 *
 * Mantiene el SDK aislado (igual que catalogRemoteService y authService),
 * para que src/services no dependa directamente de firebase/firestore.
 */
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from './firestore';

const COLLECTION = 'homeBookings';

/**
 * Crea un documento de reserva.
 * @param {Object} data - datos de la reserva (date, timeSlot, userId, ...)
 * @returns {Promise<string>} id del documento creado
 */
export async function addBooking(data) {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Devuelve los ids de franjas (timeSlot) ya reservadas para una fecha.
 * Capacidad 1: cualquier reserva existente en esa franja la marca ocupada.
 * @param {string} dateId - id/ISO de la fecha
 * @returns {Promise<string[]>}
 */
export async function fetchOccupiedSlots(dateId) {
  const q = query(collection(db, COLLECTION), where('date', '==', dateId));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => doc.data().timeSlot)
    .filter(Boolean);
}

/**
 * Devuelve las reservas de un usuario.
 * Solo filtra por userId (sin orderBy) para no requerir indice compuesto;
 * el orden se aplica en el cliente.
 * @param {string} userId
 * @returns {Promise<Array<{ id: string, ...Object }>>}
 */
export async function fetchUserBookings(userId) {
  const q = query(collection(db, COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export default { addBooking, fetchOccupiedSlots, fetchUserBookings };

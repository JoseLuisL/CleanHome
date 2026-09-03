/**
 * Lecturas de catalogo desde Cloud Firestore.
 *
 * Mantiene el acceso a Firestore aislado (igual que authService con Auth),
 * para que la capa de servicios (src/services) no dependa del SDK.
 */
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { db } from './firestore';

export async function fetchHomeSpaces() {
  const spacesQuery = query(collection(db, 'homeSpaces'), orderBy('order'));
  const objSpaces = await getDocs(spacesQuery);
  return objSpaces.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Trae las tarjetas de "home features" desde la coleccion homeFeature,
 * ordenadas por el campo `order`.
 * @returns {Promise<Array<{ id: string, icon: string, title: string, text: string, order: number }>>}
 */
export async function fetchHomeFeatures() {
  const q = query(collection(db, 'homeFeature'), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Trae las tarjetas de "home benefits" desde la coleccion homeBenefits,
 * ordenadas por el campo `order`.
 * @returns {Promise<Array<{ id: string, label: string, icon: string, order: number }>>}
 */

export async function fetchHomeBenefits(){
  const benefit = query(collection(db, 'homeBenefits'), orderBy('order'));
  const objBenefit = await getDocs(benefit);

  return objBenefit.docs.map((doc) => ({ id: doc.id, ...doc.data()}) );
}

export default { 
  fetchHomeFeatures, 
  fetchHomeBenefits,
  fetchHomeSpaces 
};

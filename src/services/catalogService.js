/**
 * Servicio de catalogo.
 * Expone espacios, tipos de limpieza, fechas y horarios.
 * En este demo devuelve datos locales (assets/data). Cuando exista backend,
 * reemplaza los retornos por llamadas a `api.get(...)`.
 */
import spaces from '../assets/data/spaces.json';
import cleaningTypes from '../assets/data/cleaningTypes.json';
import timeSlots from '../assets/data/timeSlots.json';
import benefits from '../assets/data/benefits.json';
import homeFeatures from '../assets/data/homeFeatures.json';
import districts from '../assets/data/districts.json';
import { fetchHomeFeatures, fetchHomeBenefits, fetchHomeSpaces } from '../firebase/catalogRemoteService';
// import api from './api';

const simulateLatency = (data, ms = 250) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

//export const getSpaces = () => simulateLatency(spaces);
export const getCleaningTypes = () => simulateLatency(cleaningTypes);
export const getTimeSlots = () => simulateLatency(timeSlots);

/** Distritos de Lima Metropolitana para el selector de ubicacion. */
export const getDistricts = () => simulateLatency(districts);

// Etiquetas en espanol para construir las fechas dinamicas.
const WEEKDAYS_ES = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/**
 * Genera las proximas `count` fechas a partir de hoy.
 * Cada item: { id (ISO), iso, weekday (LUN..), day ("27"), monthLabel, fullLabel }.
 * @param {number} count - cantidad de dias a mostrar (por defecto 7)
 */
export const getDates = (count = 7) => {
  const today = new Date();
  const list = [];

  for (let i = 0; i < count; i += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const iso = d.toISOString().slice(0, 10); // YYYY-MM-DD, id estable
    list.push({
      id: iso,
      iso,
      weekday: WEEKDAYS_ES[d.getDay()],
      day: String(d.getDate()),
      monthLabel: MONTHS_ES[d.getMonth()],
      fullLabel: `${WEEKDAYS_ES[d.getDay()]}, ${d.getDate()} de ${MONTHS_ES[d.getMonth()]}`,
    });
  }

  return simulateLatency(list);
};

export const getSpaces = async() =>{
  try{
    const remoteSpaces = await fetchHomeSpaces();

    // Log de depuracion: cuantos espacios llegaron y su contenido.
    console.log('[getSpaces] remoteSpaces count:', remoteSpaces.length);
    remoteSpaces.forEach((element) => {
      console.log('[getSpaces] remoteSpace -->', JSON.stringify(element));
    });

    return remoteSpaces.length ? remoteSpaces : spaces;
  }catch(e){
    console.log('[getSpaces] fallback a JSON local:', e.code || e.message);
    return spaces;
  }
} 

/**
 * Trae las "home benefits" desde Firestore.
 * Si la lectura falla (sin internet, permisos, coleccion vacia) usa el
 * JSON local como respaldo para que la Home nunca aparezca vacia.
 */
export const getBenefits = async() =>{
  try{
    const remoteBenefit = await fetchHomeBenefits();
    return remoteBenefit.length ? remoteBenefit : benefits;
  }catch(e){
    console.log('[getBenefits] fallback a JSON local:', e.code || e.message);
    return benefits;
  }
} 

/**
 * Trae las "home features" desde Firestore.
 * Si la lectura falla (sin internet, permisos, coleccion vacia) usa el
 * JSON local como respaldo para que la Home nunca aparezca vacia.
 */
export const getHomeFeatures = async () => {
  try {
    const remote = await fetchHomeFeatures();
    return remote.length ? remote : homeFeatures;
  } catch (e) {
    console.log('[getHomeFeatures] fallback a JSON local:', e.code || e.message);
    return homeFeatures;
  }
};

export default {
  getSpaces,
  getCleaningTypes,
  getTimeSlots,
  getDates,
  getBenefits,
  getHomeFeatures,
  getDistricts,
};

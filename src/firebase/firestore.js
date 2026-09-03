/**
 * Inicializacion de Cloud Firestore.
 * Reutiliza la misma instancia de Firebase App creada en ./firebase.
 */
import { getFirestore } from 'firebase/firestore';

import { app } from './firebase';

export const db = getFirestore(app);

export default db;

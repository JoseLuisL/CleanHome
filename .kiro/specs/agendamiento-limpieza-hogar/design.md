# Diseno — App de Agendamiento de Limpieza del Hogar

## Vision general

App movil en **React Native + Expo (SDK 54)**, escrita en **JavaScript**, con
**Material Design 3** via `react-native-paper` y navegacion con
**React Navigation (native stack)**. El backend es **Firebase**
(Authentication + Cloud Firestore). La arquitectura separa responsabilidades en
capas: pantallas (screens), componentes reutilizables (items), servicios de
dominio (services), acceso a Firebase (firebase), estado global (context) y
datos locales (assets).

## Stack tecnico

- Expo SDK ~54, React Native 0.81, React 19.1
- react-native-paper 5 (Material Design 3)
- @react-navigation/native + native-stack 7
- firebase 12 (Auth + Firestore) con persistencia via @react-native-async-storage/async-storage
- expo-location (permiso, coordenadas, geocoding inverso)
- Android target por defecto de SDK 54 (edge-to-edge habilitado)

## Estructura del proyecto

```
App.js                         Providers: SafeArea > Paper > Auth > Booking > Navigator
index.js                       Entry point
app.json                       Config Expo (permisos ubicacion, plugin expo-location)
eas.json                       Perfiles de build (preview = APK, production = AAB)
src/
  navigation/AppNavigator.js   AuthStack / AppStack segun sesion + SplashLoading
  screens/                     Pantallas + logica de cada una
    LoginScreen, RegisterScreen
    HomeScreen
    JobDetailsScreen           Paso 2: espacios + subtotal
    CleaningTypeScreen         Paso 3: tipo de limpieza
    ScheduleScreen             Paso 4: fecha + horario con disponibilidad
    LocationScreen             Paso 5: direccion, referencia, contacto
    ConfirmationScreen         Paso 6: resumen + creacion de reserva
    BookingHistoryScreen       Historico de reservas
  items/                       Componentes UI reutilizables
    Stepper, StepLayout, ScreenHeader, PrimaryButton, LabeledInput,
    SelectableTile, OptionCard, DateChip, TimeSlot,
    BenefitRow, FeatureRow, SummaryRow
  services/                    Logica de dominio (aisla libs externas)
    api.js                     Cliente fetch base
    catalogService.js          Espacios, tipos, franjas, fechas dinamicas, beneficios, features
    bookingService.js          createBooking, getAvailability, getUserBookings
    pricingService.js          calculateQuote, formatSoles (soles)
    locationService.js         getCurrentLocation, mapLocationError
  firebase/                    Acceso aislado a Firebase
    firebaseConfig.js          Credenciales del proyecto
    firebase.js                initializeApp + initializeAuth (persistencia RN)
    firestore.js               getFirestore
    authService.js             login, register, logout, subscribeToAuthChanges, mapAuthError
    catalogRemoteService.js    fetchHomeSpaces/Benefits/Features
    bookingRemoteService.js    addBooking, fetchOccupiedSlots, fetchUserBookings
  context/
    AuthContext.js             Sesion (user, initializing, isAuthenticated, acciones)
    BookingContext.js          Estado del flujo de reserva
  theme/theme.js               Tema MD3 (paleta azul) + colors exportados
  assets/data/                 JSON de respaldo local
```

## Arquitectura por capas

```
Pantalla (screen)  ->  Servicio de dominio (services)  ->  Acceso Firebase (firebase)  ->  Firestore/Auth
                                     |                              (respaldo)
                                     +--> assets/data (fallback JSON)
```

Principio: las pantallas nunca importan el SDK de Firebase directamente. Cada
servicio de dominio decide fuente de datos y aplica el fallback.

## Navegacion

- **Root** (`AppNavigator`): decide segun `useAuth()`.
  - `initializing` -> `SplashLoading`.
  - No autenticado -> `AuthStack` (Login, Register).
  - Autenticado -> `AppStack` (Home, JobDetails, CleaningType, Schedule, Location, Confirmation, BookingHistory).
- El cambio Login->Home (y logout->Login) es reactivo: depende de `isAuthenticated`, sin `navigate` manual.

## Estado global

**AuthContext**: se suscribe a `onAuthStateChanged`. Expone `user`,
`initializing`, `isAuthenticated`, y `login/register/logout/resetPassword`.

**BookingContext**: acumula el flujo mientras el usuario avanza.
```
{
  propertyType: 'departamento', // MVP fijo
  spaces: [],                   // ids de espacios
  cleaningType: null,           // id del tipo
  date: null,                   // ISO YYYY-MM-DD
  timeSlot: null,               // id de franja
  address: '', reference: '', phone: ''
}
```
Acciones: `update(patch)`, `toggleSpace(id)`, `reset()`.

## Modelo de datos (Firestore)

### Catalogos (lectura publica)
- `homeSpaces`   : { label, icon, price, order }
- `homeBenefits` : { label, icon, order }
- `homeFeature`  : { title, text, icon, order }

### Reservas
- `homeBookings` : {
    userId, date (ISO), timeSlot, spaces[], cleaningType,
    address, reference, phone, propertyType,
    total, bookingNumber, status, createdAt
  }

## Calculo de precio (Modelo A - multiplicador)

`pricingService.calculateQuote(allSpaces, selectedIds, cleaningType)`:
1. Filtra el catalogo por ids seleccionados -> `lineItems` con precio.
2. `subtotal` = suma de precios.
3. `multiplier` = `cleaningType.priceMultiplier` (Express 1.0, Profunda 1.6) o 1.
4. `total` = `subtotal * multiplier`.

`formatSoles(monto)` -> "S/ 0.00". Los precios estan en soles.

## Disponibilidad y reservas

- **Lectura** (`getAvailability(dateId)`): consulta `homeBookings` por `date` y
  devuelve los `timeSlot` ocupados (capacidad 1). Fallback optimista: si falla,
  devuelve `[]` (todo disponible).
- **Escritura** (`createBooking(booking, userId)`): concurrencia **nivel simple**
  — relee las franjas ocupadas justo antes de escribir; si la elegida ya esta
  tomada lanza `SlotTakenError`. Si no, crea el documento con `userId` y
  `createdAt` de servidor.
- **Historico** (`getUserBookings(userId)`): consulta por `userId` (sin
  `orderBy`, para evitar indice compuesto) y ordena en el cliente por
  `createdAt` descendente.

## Fechas dinamicas

`catalogService.getDates(count=7)` genera los proximos dias reales desde hoy.
Cada fecha: `{ id (ISO), iso, weekday, day, monthLabel, fullLabel }`. Los nombres
de dia y mes se generan en espanol.

## Ubicacion

`locationService.getCurrentLocation()`:
1. Verifica servicios de ubicacion activos.
2. Solicita permiso foreground.
3. Obtiene coordenadas (accuracy High).
4. Geocoding inverso -> direccion legible (servicio del SO, sin API key).
Errores tipados via `LocationError` con `code` y `mapLocationError`.

## UI / Material Design 3

- Tema en `theme.js` con paleta azul (`primary #1565FF`).
- `StepLayout` unifica las pantallas del flujo: header + Stepper + contenido scrollable + boton fijo.
- Iconos de MaterialCommunityIcons (incluidos por react-native-paper).
- Menu hamburguesa en Home via `Menu` de paper (Historico de reservas, Cerrar sesion).

## Decisiones y consideraciones

- **Firebase aislado**: cambiar de proveedor o mockear se hace en la capa `firebase/`.
- **Fallback local**: los catalogos nunca dejan la UI vacia si Firestore falla.
- **Persistencia de sesion**: `initializeAuth` con `getReactNativePersistence(AsyncStorage)`.
- **Reglas de Firestore**: catalogos de lectura publica; `homeBookings` solo para
  usuarios autenticados (crear a su propio nombre; sin update/delete).
- **Verificacion**: el bundle se valida con `expo export --platform android --no-bytecode`
  (evita la limitacion de hermesc en Windows durante el export).

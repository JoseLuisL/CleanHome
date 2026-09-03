# Limpieza del Hogar

App de agendamiento de limpieza del hogar construida con **React Native + Expo (SDK 54)**, **Material Design 3** (react-native-paper) y **React Navigation** (native stack). Implementa el flujo de 6 pasos del diseno: Inicio, Detalles del trabajo, Tipo de limpieza, Fecha y horario, Ubicacion y Confirmacion.

## Requisitos

- Node.js 18+
- Expo Go (para probar en dispositivo) o un emulador Android/iOS

## Instalacion y ejecucion

```bash
npm install
npm start        # abre el dev server de Expo
npm run android  # abre en emulador/dispositivo Android
npm run ios      # abre en simulador iOS (macOS)
```

## Estructura del proyecto

```
.
├── App.js                     # Providers (SafeArea, Paper, Booking) + Navigator
├── index.js                   # Entry point (registerRootComponent)
├── app.json                   # Config Expo (SDK 54, edge-to-edge Android)
└── src/
    ├── navigation/
    │   └── AppNavigator.js     # Stack navigator con las 6 pantallas
    ├── screens/                # Pantallas principales + logica de cada una
    │   ├── LoginScreen.js      # Inicio de sesion
    │   ├── RegisterScreen.js   # Registro de cuenta
    │   ├── HomeScreen.js
    │   ├── JobDetailsScreen.js
    │   ├── CleaningTypeScreen.js
    │   ├── ScheduleScreen.js
    │   ├── LocationScreen.js
    │   └── ConfirmationScreen.js
    ├── items/                  # Componentes reutilizables (UI)
    │   ├── Stepper.js          # Indicador de pasos
    │   ├── StepLayout.js       # Layout comun (header + stepper + boton)
    │   ├── ScreenHeader.js
    │   ├── PrimaryButton.js
    │   ├── SelectableTile.js   # Tarjeta de espacio (grid)
    │   ├── OptionCard.js       # Tarjeta de tipo de limpieza
    │   ├── DateChip.js         # Chip de fecha
    │   ├── TimeSlot.js         # Fila de horario
    │   ├── LabeledInput.js     # Input de texto con etiqueta
    │   ├── BenefitRow.js
    │   ├── FeatureRow.js
    │   └── SummaryRow.js
    ├── services/               # Llamadas a APIs
    │   ├── api.js              # Cliente fetch base (baseURL, headers)
    │   ├── catalogService.js   # Catalogo (espacios, tipos, fechas, horarios)
    │   └── bookingService.js   # Creacion de reserva
    ├── firebase/               # Integracion de Firebase (aislada)
    │   ├── firebaseConfig.js   # Claves del proyecto (reemplazar placeholders)
    │   ├── firebase.js         # initializeApp + Auth con persistencia AsyncStorage
    │   └── authService.js      # Wrapper de auth (login/register/logout/...)
    ├── context/
    │   ├── AuthContext.js      # Estado de sesion (useAuth)
    │   └── BookingContext.js   # Estado compartido del flujo
    ├── theme/
    │   └── theme.js            # Tema Material Design 3 (paleta azul)
    └── assets/
        └── data/               # JSON (espacios, tipos, horarios, fechas, etc.)
```

## Autenticacion (Firebase Auth)

La integracion de Firebase esta aislada en `src/firebase/`. Para activarla:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/) y habilita **Authentication > Email/Password**.
2. Copia las credenciales de tu app web en `src/firebase/firebaseConfig.js` (reemplaza los `TU_...`).
3. Listo: `LoginScreen` y `RegisterScreen` usan el `AuthContext`, que se apoya en `authService`.

Flujo de navegacion (`AppNavigator`):
- Mientras Firebase resuelve la sesion inicial se muestra un splash con spinner.
- Sin sesion -> `AuthStack` (Login / Register).
- Con sesion -> `AppStack` (flujo de agendamiento). El cambio es automatico via `onAuthStateChanged`.

La sesion persiste entre reinicios gracias a `getReactNativePersistence(AsyncStorage)`.

## Notas

- Los servicios (`catalogService`, `bookingService`) devuelven datos locales simulando latencia de red. Para conectar un backend real, reemplaza los retornos por llamadas a `api.get(...)` / `api.post(...)` y ajusta `BASE_URL` en `src/services/api.js`.
- El estado del flujo (espacios, tipo, fecha, horario, direccion, referencias) se comparte entre pantallas mediante `BookingContext`.
- Los iconos provienen de MaterialCommunityIcons, incluidos por react-native-paper.

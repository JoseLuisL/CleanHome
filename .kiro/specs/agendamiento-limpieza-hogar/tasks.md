# Plan de implementacion — App de Agendamiento de Limpieza del Hogar

Estado: todas las tareas fueron implementadas. Este plan documenta el trabajo
realizado; cada item referencia los requerimientos que satisface.

- [x] 1. Estructura base del proyecto Expo (SDK 54, JS)
  - Configurar package.json, app.json, babel, index/App con providers.
  - Tema Material Design 3 (react-native-paper) con paleta azul.
  - _Requerimientos: R2_

- [x] 2. Navegacion con React Navigation
  - AppNavigator con native stack.
  - AuthStack / AppStack segun sesion + pantalla de carga inicial.
  - _Requerimientos: R1.5, R1.6_

- [x] 3. Componentes reutilizables (items/)
  - Stepper, StepLayout, ScreenHeader, PrimaryButton, LabeledInput.
  - SelectableTile, OptionCard, DateChip, TimeSlot, BenefitRow, FeatureRow, SummaryRow.
  - _Requerimientos: R2, R4, R5, R6_

- [x] 4. Datos locales y servicios de catalogo
  - JSON en assets/data (espacios, tipos, franjas, beneficios, features).
  - catalogService con latencia simulada.
  - _Requerimientos: R4, R5, R11_

- [x] 5. Flujo de agendamiento (6 pantallas)
  - Home, JobDetails, CleaningType, Schedule, Location, Confirmation.
  - Estado compartido en BookingContext.
  - _Requerimientos: R2, R4, R5, R6, R7, R9_

- [x] 6. Autenticacion con Firebase
  - firebase/ aislado: firebaseConfig, firebase (initializeAuth + persistencia), authService.
  - AuthContext (user, initializing, isAuthenticated, acciones).
  - LoginScreen y RegisterScreen con validacion y errores en espanol.
  - Navegacion reactiva segun sesion; logout.
  - _Requerimientos: R1_

- [x] 7. Deteccion de ubicacion
  - expo-location + permisos/plugin en app.json.
  - locationService (permiso, coordenadas, geocoding inverso, errores tipados).
  - Disparador en Home; guardado en BookingContext.
  - _Requerimientos: R3_

- [x] 8. Catalogos remotos en Firestore con fallback
  - firestore.js + catalogRemoteService (spaces, benefits, features).
  - catalogService conecta a Firestore con respaldo al JSON local.
  - _Requerimientos: R11_

- [x] 9. Costo por espacio (Modelo A - multiplicador)
  - price por espacio y priceMultiplier por tipo de limpieza.
  - pricingService (calculateQuote, formatSoles en soles).
  - Subtotal en vivo en JobDetails; desglose + total en Confirmation.
  - _Requerimientos: R8_

- [x] 10. MVP acotado a departamentos
  - propertyType fijo en el contexto.
  - Aviso de alcance en JobDetails; fila de tipo de vivienda en Confirmation.
  - _Requerimientos: R4.2, R9.1_

- [x] 11. Fechas dinamicas y disponibilidad
  - getDates genera proximos dias reales (etiquetas en espanol).
  - TimeSlot con estado ocupado (no seleccionable).
  - ScheduleScreen carga disponibilidad al elegir fecha, con spinner y reset de franja.
  - _Requerimientos: R6_

- [x] 12. Direccion y contacto (simplificacion de LocationScreen)
  - Formulario: direccion, referencia, numero de contacto (sin mapa).
  - Campo phone en el contexto; validacion; mostrado en Confirmation.
  - _Requerimientos: R7_

- [x] 13. Reservas y disponibilidad reales en Firestore
  - bookingRemoteService: addBooking, fetchOccupiedSlots.
  - bookingService: getAvailability (fallback optimista) y createBooking (nivel simple, SlotTakenError).
  - ConfirmationScreen pasa userId y maneja franja ocupada.
  - _Requerimientos: R6.2, R6.6, R9.2, R9.3, R9.4_

- [x] 14. Menu hamburguesa e historico de reservas
  - fetchUserBookings + getUserBookings (orden en cliente).
  - BookingHistoryScreen (tarjetas simples: dia/hora, precio, codigo; estados y pull-to-refresh).
  - Menu en Home (Historico, Cerrar sesion); ruta en el navigator.
  - _Requerimientos: R2.4, R10_

- [x] 15. Empaquetado para APK
  - eas.json con perfil preview (APK) y production (AAB).
  - _Requerimientos: (soporte de despliegue)_

## Pendientes / futuras iteraciones

- [ ] 16. Reglas de seguridad de Firestore para produccion
  - Catalogos de lectura publica; homeBookings restringido a usuarios autenticados.
  - _Requerimientos: R9.4, R10.1, R11_

- [ ] 17. Recuperacion de contrasena (pantalla)
  - Conectar resetPassword del AuthContext a una pantalla dedicada.
  - _Requerimientos: R1_

- [ ] 18. Soporte para casas
  - Precios por tipo de vivienda y filtrado de espacios (Enfoque 3).
  - _Requerimientos: (ampliacion de R4)_

- [ ] 19. Icono y splash reales
  - Reemplazar assets por defecto de Expo antes de publicar.

# Requerimientos — App de Agendamiento de Limpieza del Hogar

## Introduccion

Aplicacion movil (React Native + Expo, Material Design 3) que permite a un
usuario agendar servicios de limpieza para su departamento a traves de un flujo
guiado por pasos. Incluye autenticacion con Firebase, catalogos y disponibilidad
en Cloud Firestore, deteccion de ubicacion, calculo de costo por espacio e
historico de reservas.

Este documento describe el comportamiento del sistema tal como fue construido.
El MVP esta acotado a **departamentos**.

## Glosario

- **Espacio**: ambiente a limpiar (habitacion, sala, cocina, bano, etc.), con un precio.
- **Tipo de limpieza**: Express (x1.0) o Profunda (x1.6); aplica un multiplicador al subtotal.
- **Franja horaria (timeSlot)**: bloque de dos horas seleccionable en una fecha.
- **Reserva**: agendamiento confirmado, guardado en la coleccion `homeBookings`.

## Requerimientos

### R1 — Autenticacion de usuarios

**Historia:** Como usuario, quiero registrarme e iniciar sesion, para acceder a
la app y gestionar mis reservas.

#### Criterios de aceptacion
1. CUANDO el usuario no tiene sesion, EL SISTEMA DEBE mostrar el flujo de autenticacion (Login/Registro).
2. CUANDO el usuario envia el formulario de registro con nombre, correo, contrasena y confirmacion validos, EL SISTEMA DEBE crear la cuenta en Firebase y asignar el nombre como displayName.
3. CUANDO el usuario envia el login con correo y contrasena validos, EL SISTEMA DEBE iniciar la sesion.
4. SI las credenciales o los datos son invalidos, ENTONCES EL SISTEMA DEBE mostrar un mensaje de error en espanol.
5. CUANDO cambia el estado de sesion, EL SISTEMA DEBE navegar automaticamente entre el flujo de autenticacion y el flujo de la app sin navegacion manual.
6. CUANDO la app inicia, EL SISTEMA DEBE mostrar una pantalla de carga mientras Firebase resuelve la sesion existente (persistida en el dispositivo).
7. CUANDO el usuario cierra sesion, EL SISTEMA DEBE volver al flujo de autenticacion.

### R2 — Inicio y presentacion del servicio

**Historia:** Como usuario, quiero ver una pantalla de inicio clara, para
entender el servicio y comenzar a agendar.

#### Criterios de aceptacion
1. EL SISTEMA DEBE saludar al usuario por su nombre.
2. EL SISTEMA DEBE mostrar la tarjeta principal del servicio con un boton para iniciar el flujo de agendamiento.
3. EL SISTEMA DEBE mostrar los motivos para elegir el servicio (beneficios) y una seccion de caracteristicas.
4. EL SISTEMA DEBE ofrecer un menu (hamburguesa) con acceso al historico de reservas y a cerrar sesion.

### R3 — Deteccion de ubicacion

**Historia:** Como usuario, quiero detectar mi ubicacion actual, para
autocompletar mi direccion.

#### Criterios de aceptacion
1. CUANDO el usuario toca "Mi ubicacion" en el inicio, EL SISTEMA DEBE solicitar permiso de ubicacion y obtener las coordenadas.
2. CUANDO se obtienen coordenadas, EL SISTEMA DEBE convertirlas a una direccion legible (geocoding inverso) y guardarla.
3. SI el permiso es denegado o el GPS esta desactivado, ENTONCES EL SISTEMA DEBE mostrar un mensaje claro y permitir continuar con ingreso manual.
4. MIENTRAS se obtiene la ubicacion, EL SISTEMA DEBE mostrar un indicador de carga.

### R4 — Seleccion de espacios (paso 2)

**Historia:** Como usuario, quiero elegir los espacios a limpiar, para definir
el alcance del servicio.

#### Criterios de aceptacion
1. EL SISTEMA DEBE mostrar los espacios disponibles en una cuadricula seleccionable multiple.
2. EL SISTEMA DEBE indicar que el servicio esta disponible solo para departamentos.
3. CUANDO el usuario selecciona o deselecciona espacios, EL SISTEMA DEBE actualizar el contador y el subtotal en soles en vivo.
4. SI no hay ningun espacio seleccionado, ENTONCES EL SISTEMA DEBE deshabilitar el boton de continuar.

### R5 — Tipo de limpieza (paso 3)

**Historia:** Como usuario, quiero elegir el tipo de limpieza, para ajustar el
servicio a mi necesidad.

#### Criterios de aceptacion
1. EL SISTEMA DEBE mostrar las opciones de tipo de limpieza (Express, Profunda) con seleccion unica.
2. EL SISTEMA DEBE resaltar la opcion recomendada.
3. SI no hay tipo seleccionado, ENTONCES EL SISTEMA DEBE deshabilitar el boton de continuar.

### R6 — Fecha y horario con disponibilidad real (paso 4)

**Historia:** Como usuario, quiero elegir fecha y horario viendo que franjas
estan ocupadas, para agendar en un horario disponible.

#### Criterios de aceptacion
1. EL SISTEMA DEBE mostrar los proximos dias reales a partir de hoy como fechas seleccionables.
2. CUANDO el usuario elige una fecha, EL SISTEMA DEBE consultar en Firestore las franjas ya reservadas de esa fecha y marcarlas como no disponibles.
3. UNA franja marcada como ocupada NO DEBE ser seleccionable.
4. MIENTRAS se consulta la disponibilidad, EL SISTEMA DEBE mostrar un indicador de carga.
5. CUANDO el usuario cambia de fecha, EL SISTEMA DEBE reiniciar la franja seleccionada.
6. SI la consulta de disponibilidad falla, ENTONCES EL SISTEMA DEBE mostrar todas las franjas como disponibles (fallback optimista).
7. SI no hay fecha o franja seleccionada, ENTONCES EL SISTEMA DEBE deshabilitar el boton de continuar.

### R7 — Direccion y contacto (paso 5)

**Historia:** Como usuario, quiero indicar mi direccion, referencia y numero de
contacto, para que el equipo pueda ubicarme.

#### Criterios de aceptacion
1. EL SISTEMA DEBE presentar campos para direccion, referencia (opcional) y numero de contacto.
2. SI la direccion o el numero de contacto estan vacios, ENTONCES EL SISTEMA DEBE impedir continuar y mostrar el error del campo.
3. SI el numero de contacto no tiene un formato valido, ENTONCES EL SISTEMA DEBE mostrar un error.

### R8 — Calculo de costo

**Historia:** Como usuario, quiero ver cuanto costara el servicio, para decidir
con transparencia.

#### Criterios de aceptacion
1. EL SISTEMA DEBE calcular el subtotal como la suma de los precios de los espacios seleccionados.
2. EL SISTEMA DEBE calcular el total como subtotal multiplicado por el multiplicador del tipo de limpieza.
3. EL SISTEMA DEBE expresar los montos en soles (S/).
4. EL SISTEMA DEBE mostrar el subtotal en vivo en el paso de espacios y el desglose completo con total en la confirmacion.

### R9 — Confirmacion y creacion de reserva (paso 6)

**Historia:** Como usuario, quiero confirmar mi reserva, para agendar el servicio.

#### Criterios de aceptacion
1. EL SISTEMA DEBE mostrar un resumen: tipo de vivienda, servicios, tipo de limpieza, fecha, horario, direccion, referencia (si existe), contacto y desglose de costo.
2. CUANDO se confirma, EL SISTEMA DEBE, antes de escribir, verificar que la franja siga disponible.
3. SI la franja ya fue reservada, ENTONCES EL SISTEMA DEBE mostrar un error y ofrecer volver al paso de horario.
4. CUANDO la franja esta disponible, EL SISTEMA DEBE guardar la reserva en Firestore asociada al usuario, con numero de reserva y total.
5. CUANDO la reserva se crea, EL SISTEMA DEBE mostrar el numero de reserva y permitir volver al inicio.

### R10 — Historico de reservas

**Historia:** Como usuario, quiero ver mis reservas anteriores, para consultarlas.

#### Criterios de aceptacion
1. CUANDO el usuario abre el historico, EL SISTEMA DEBE listar sus reservas ordenadas de mas reciente a mas antigua.
2. EL SISTEMA DEBE mostrar cada reserva de forma simplificada: dia y hora, precio y codigo de reserva.
3. SI el usuario no tiene reservas, ENTONCES EL SISTEMA DEBE mostrar un estado vacio.
4. EL SISTEMA DEBE permitir recargar la lista (pull-to-refresh).

### R11 — Catalogos remotos con respaldo local

**Historia:** Como usuario, quiero que la informacion del servicio cargue
siempre, incluso sin conexion optima.

#### Criterios de aceptacion
1. EL SISTEMA DEBE obtener espacios, beneficios y caracteristicas desde Firestore.
2. SI una lectura de catalogo falla, ENTONCES EL SISTEMA DEBE usar datos locales (JSON) como respaldo.

## Fuera de alcance (MVP)

- Casas (solo departamentos).
- Precios por tipo de vivienda y filtrado de espacios por vivienda.
- Pagos en linea.
- Mapa interactivo.
- Capacidad mayor a 1 por franja y control de concurrencia robusto (transacciones).
- Recuperacion de contrasena (pantalla pendiente).

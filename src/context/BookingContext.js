import React, { createContext, useContext, useState, useMemo } from 'react';

/**
 * Contexto que mantiene el estado del flujo de agendamiento
 * mientras el usuario avanza por las pantallas.
 */
const BookingContext = createContext(null);

const initialState = {
  propertyType: 'departamento', // MVP: el servicio solo aplica a departamentos
  spaces: [],          // ids de espacios seleccionados
  cleaningType: null,  // id del tipo de limpieza
  date: null,          // id de fecha
  timeSlot: null,      // id de horario
  district: null,      // id del distrito de Lima
  address: '',
  reference: '',
  phone: '',
};

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(initialState);

  const update = (patch) => setBooking((prev) => ({ ...prev, ...patch }));

  const toggleSpace = (id) =>
    setBooking((prev) => {
      const exists = prev.spaces.includes(id);
      return {
        ...prev,
        spaces: exists
          ? prev.spaces.filter((s) => s !== id)
          : [...prev.spaces, id],
      };
    });

  const reset = () => setBooking(initialState);

  const value = useMemo(
    () => ({ booking, update, toggleSpace, reset }),
    [booking]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBooking debe usarse dentro de <BookingProvider>');
  }
  return ctx;
}

export default BookingContext;

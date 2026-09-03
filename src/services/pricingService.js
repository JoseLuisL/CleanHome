/**
 * Servicio de precios.
 * Centraliza el calculo del costo de la reserva (Modelo A - multiplicador):
 *   total = suma(precio de espacios seleccionados) * multiplicador del tipo
 * Toda la logica de precio vive aqui; las pantallas solo muestran el resultado.
 */

export const CURRENCY = 'S/';

/** Formatea un monto en soles: 108.8 -> "S/ 108.80". */
export function formatSoles(amount) {
  const value = Number.isFinite(amount) ? amount : 0;
  return `${CURRENCY} ${value.toFixed(2)}`;
}

/**
 * Calcula la cotizacion a partir de los espacios seleccionados y el tipo.
 *
 * @param {Array<{id:string,label:string,price:number}>} allSpaces - catalogo completo de espacios
 * @param {string[]} selectedSpaceIds - ids seleccionados (booking.spaces)
 * @param {{priceMultiplier?:number}|null} cleaningType - tipo de limpieza elegido (o null)
 * @returns {{
 *   lineItems: Array<{id:string,label:string,price:number}>,
 *   subtotal: number,
 *   multiplier: number,
 *   total: number
 * }}
 */
export function calculateQuote(allSpaces = [], selectedSpaceIds = [], cleaningType = null) {
  const lineItems = allSpaces
    .filter((s) => selectedSpaceIds.includes(s.id))
    .map((s) => ({ id: s.id, label: s.label, price: Number(s.price) || 0 }));

  const subtotal = lineItems.reduce((sum, item) => sum + item.price, 0);
  const multiplier = Number(cleaningType?.priceMultiplier) || 1;
  const total = subtotal * multiplier;

  return { lineItems, subtotal, multiplier, total };
}

export default { CURRENCY, formatSoles, calculateQuote };

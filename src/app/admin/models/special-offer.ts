// src/app/models/special-offer.model.ts

/**
 * Interfejs opisujący obiekt SpecialOffer zwracany przez backend.
 */
export interface SpecialOffer {
  id: string;
  dish_id: string;
  name: string;
  special_price: number;
  [key: string]: any;
}

/**
 * Payload do tworzenia nowej oferty specjalnej.
 */
export interface SpecialOfferCreate {
  dish_id: string;
  name: string;
  special_price: number;
}

/**
 * Payload do aktualizacji oferty (zmiana ceny specjalnej).
 */
export interface SpecialOfferUpdate {
  special_price: number;
}

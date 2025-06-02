// src/app/models/dish.model.ts

/**
 * Interfejs odpowiadający full Dish zwracanym/akceptowanym przez backend:
 * - id: string
 * - name: string
 * - description: string
 * - price: number
 * - category?: string
 */
export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
}

/**
 * Payload do tworzenia nowego dania: tak, jak wymaga Pydantic: price (nie base_price).
 */
export interface DishCreate {
  name: string;
  description: string;
  price: number;
  category?: string;
}

/**
 * Payload do aktualizacji: wszystkie pola poza id, a price zamiast base_price.
 */
export interface DishUpdate {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
}


// export interface Dish {
//   /** Unikalne ID dania */
//   id: string;
//   /** Nazwa dania */
//   name: string;
//   /** Opis dania */
//   description: string;
//   /** Cena bazowa dania */
//   price: number;
//   /** Cena promocyjna (opcjonalna) */
//   promoPrice?: number;
//   /** Składniki dania (string, np. "mąka, jajka, mleko") */
//   ingredients: string;
//   /** Punkty zdobywane za zamówienie tego dania */
//   points: number;
//   /** Liczba sztuk w magazynie */
//   stockCount: number;
//   /** Flaga dostępności dania */
//   isAvailable: boolean;
// }

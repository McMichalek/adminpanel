export interface Dish {
  /** Unikalne ID dania */
  id: string;
  /** Nazwa dania */
  name: string;
  /** Opis dania */
  description: string;
  /** Cena bazowa dania */
  price: number;
  /** Cena promocyjna (opcjonalna) */
  promoPrice?: number;
  /** Składniki dania (string, np. "mąka, jajka, mleko") */
  ingredients: string;
  /** Punkty zdobywane za zamówienie tego dania */
  points: number;
  /** Liczba sztuk w magazynie */
  stockCount: number;
  /** Flaga dostępności dania */
  isAvailable: boolean;
  restaurant_id?: "1";
}

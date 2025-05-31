// src/app/models/opinion.model.ts

/**
 * Enum ze statusami opinii (jeśli w backendzie byłoby potrzebne – tutaj
 * traktujemy opinie jako proste obiekty, więc nie mamy dodatkowych statusów).
 * Pozostawiamy enum, jeśli w przyszłości dodamy np. moderację (PENDING, APPROVED, REJECTED).
 */
export enum OpinionStatus {
  // Na tę chwilę nie używany, ale zostawione na przyszłość
  // PENDING = 'PENDING',
  // APPROVED = 'APPROVED',
  // REJECTED = 'REJECTED',
}

/**
 * Interfejs odpowiadający pełnemu obiektowi OpinionModel zwracanemu przez backend.
 */
export interface Opinion {
  id: string;
  restaurant_id: string;
  user_id: string;
  dish_id: string;
  rating: number;
  comment: string;
  // zakładamy, że backend zwraca created_at jako string ISO
  created_at: string;
  [key: string]: any;
}

/**
 * Interfejs, którego użyjemy przy tworzeniu/aktualizacji opinii (bez pola `id` i `created_at`).
 */
export interface OpinionCreate {
  restaurant_id: string;
  user_id: string;
  dish_id: string;
  rating: number;
  comment: string;
}

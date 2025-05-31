// src/app/models/restaurant.model.ts

/**
 * Interfejs odpowiadający obiektowi Restaurant zwracanemu przez backend.
 */
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  // Jeżeli w backendzie są dodatkowe pola, dorzuć je tutaj, np:
  // email?: string;
  // description?: string;
  // created_at?: string;
  [key: string]: any;
}

/**
 * Interfejs używany do tworzenia/aktualizacji restauracji (bez 'id').
 */
export interface RestaurantCreate {
  name: string;
  address: string;
  phone: string;
  // analogicznie, jeżeli w backendzie wymagane inne pola, dodaj je tutaj
  // email?: string;
  // description?: string;
}

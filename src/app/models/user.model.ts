export type Role = 'admin' | 'worker' | 'customer';

export interface User {
  id: string;
  email: string;
  role: Role;
  restaurantId?: string | null; // jeśli worker
  points: number;
  specialOffers: string[];      // lista id ofert promocyjnych
}
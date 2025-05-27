export type Role = 'admin' | 'worker' | 'customer';

export interface User {
  id: string;
  email: string;
  role: Role;
  restaurant_id?: string | null; // jeśli worker
  points: number;
  special_offers: string[];      // lista id ofert promocyjnych
}
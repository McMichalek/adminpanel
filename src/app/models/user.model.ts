export type Role = 'admin' | 'franchisee' | 'worker' | 'customer';

export interface User {
  id: number;
  email: string;
  password: string;
  role: Role;
  restaurantId?: number; // jeśli worker lub franchisee
  points: number;
  promoIds: number[];    // lista id ofert promocyjnych
}

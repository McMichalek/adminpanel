export type OrderStatus =
  | 'checkout'
  | 'paid'
  | 'in_progress'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  order_items: { [dish_id: string]: number };
  total_price: number;
  total_price_including_special_offers: number;
  status: OrderStatus;
  points_used: number;
  points_gained: number;
  created_at: string; 
  updated_at: string; 
  restaurant_id: string;
  payment_method: string;
}
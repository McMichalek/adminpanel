export enum OrderStatus {
  PAID = 'PAID',
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY',
}

export interface Order {
  id: string;
  restaurant_id: string;
  status: OrderStatus;
  // tutaj można dodać inne pola, które zwraca backend,
  // np. lista pozycji, dane klienta itd.:
  // items: Array<{ name: string; quantity: number; price: number }>;
  // total_price: number;
  // created_at: string;
  // etc.
  [key: string]: any;
}

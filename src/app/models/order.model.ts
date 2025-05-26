export type OrderStatus =
  | 'checkout'
  | 'paid'
  | 'in_progress'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  orderItems: { [dishId: string]: number };
  totalPrice: number;
  totalPriceIncludingSpecialOffers: number;
  status: OrderStatus;
  pointsUsed: number;
  pointsGained: number;
  createdAt: string;
  updatedAt: string;
  restaurantId: string;
  paymentMethod: string;
}
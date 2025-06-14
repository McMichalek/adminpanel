export type OrderState =
  | 'checkout'
  | 'payment'
  | 'paid'
  | 'in-progress'
  | 'completed'
  | 'picked-up';

export interface Order {
  id: number;
  userId: number;
  restaurantId: number;
  dishIds: number[];    // lista identyfikatorów zamówionych dań
  price: number;        // suma cen (zaaktualizowana o promocje)
  state: OrderState;
  totalPrice: number; // required by template
  status: string;
}

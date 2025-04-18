import { Promotion } from './promotion.model';


export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  restaurantId: number;
  isAvailable: boolean;
  promotion?: Promotion; // opcjonalna oferta promocyjna
}

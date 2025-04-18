import { Promotion } from './promotion.model';


export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  promotion?: Promotion; // opcjonalna oferta promocyjna
}

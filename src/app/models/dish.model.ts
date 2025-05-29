import { Promotion } from './promotion.model';


export interface Dish {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  ingredients: string;
  price: number;
  points: number;
}

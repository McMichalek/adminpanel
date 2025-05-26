import { Promotion } from './promotion.model';


export interface Dish {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  price: number;
  points: number;
}
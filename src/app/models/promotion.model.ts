export interface Promotion {
  id: number;
  restaurantId: number;
  dishId: number;      // odniesienie do Dish.id
  newPrice: number;
  title: string;               // required by template
  description: string;         // required by template
  discountPercentage: number;  // required by template
  active: boolean;  // cena promocyjna
}

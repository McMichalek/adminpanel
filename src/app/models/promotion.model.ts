export interface Promotion {
  id: number;
  dishId: number;      // odniesienie do Dish.id
  newPrice: number;    // cena promocyjna
}

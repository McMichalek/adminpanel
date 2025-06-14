export interface StockItem {
  id: number;
  restaurantId: number;
  dishId: number;
  name: string;
  unit: string;
  quantity: number;     // ilość w magazynie
}

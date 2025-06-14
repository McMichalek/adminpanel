export interface Restaurant {
  id: number;
  name: string;
  address: string;
  openingHours: string;
  promoIds: number[];  // lista identyfikatorów ofert promocyjnych
}

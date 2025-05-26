export interface Restaurant {
  id: string;
  name: string;
  city: string;
  address: string;
  openingHours: string;
  specialOffers: string[]; // lista id ofert promocyjnych
}
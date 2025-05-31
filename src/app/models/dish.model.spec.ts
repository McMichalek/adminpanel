import { Dish } from './dish.model';

describe('Dish Model', () => {
  let sampleDish: Dish;

  beforeEach(() => {
    sampleDish = {
      id: 'dish123',
      name: 'Pierogi',
      description: 'Tradycyjne pierogi z mięsem',
      price: 25.5,
      promoPrice: 19.99,
      ingredients: 'mąka, woda, mięso, cebula, sól',
      points: 10,
      stockCount: 50,
      isAvailable: true
    };
  });

  it('should create a valid Dish object', () => {
    expect(sampleDish).toBeTruthy();
  });

  it('should have all required properties with correct types', () => {
    expect(typeof sampleDish.id).toBe('string');
    expect(typeof sampleDish.name).toBe('string');
    expect(typeof sampleDish.description).toBe('string');
    expect(typeof sampleDish.price).toBe('number');
    // promoPrice jest opcjonalne, ale w naszym przykładzie mamy wartość:
    expect(typeof sampleDish.promoPrice).toBe('number');
    expect(typeof sampleDish.ingredients).toBe('string');
    expect(typeof sampleDish.points).toBe('number');
    expect(typeof sampleDish.stockCount).toBe('number');
    expect(typeof sampleDish.isAvailable).toBe('boolean');
  });

  it('should allow promoPrice to be undefined', () => {
    const dishWithoutPromo: Dish = {
      id: 'dish456',
      name: 'Kopytka',
      description: 'Domowe kopytka z ziemniaków',
      price: 20,
      // promoPrice: undefined,  // nie definiujemy
      ingredients: 'ziemniaki, mąka, jajko, sól',
      points: 8,
      stockCount: 30,
      isAvailable: false
    };
    expect(dishWithoutPromo.promoPrice).toBeUndefined();
    expect(dishWithoutPromo.name).toBe('Kopytka');
  });
});

import { Dish } from './dish.model';

describe('Dish', () => {
  it('should accept a valid object', () => {
    const dish: Dish = {
      name: 'Test',
      description: '',
      ingredients: '',
      price: 10,
      points: 1,
      id: '',
      restaurant_id: ''
    };
    expect(dish).toBeTruthy();
  });
});

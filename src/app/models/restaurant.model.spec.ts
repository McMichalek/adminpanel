import { Restaurant } from './restaurant.model';

describe('Restaurant', () => {
  it('should create an instance', () => {

    // @ts-ignore
    expect(new Restaurant()).toBeTruthy();
  });
});

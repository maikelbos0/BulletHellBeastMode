import { Acceleration } from '../src/acceleration';

describe('Acceleration', () => {
    it.each([
        [new Acceleration(10, 10), new Acceleration(3, 4), new Acceleration(13, 14)],
        [new Acceleration(10, 10), new Acceleration(-3, -4), new Acceleration(7, 6)]
    ])('add() subject: %p, expectedMagnitude: %p', (subject: Acceleration, value: Acceleration, expectedResult: Acceleration) => {
        const result = subject.add(value);
  
        expect(result.x).toBe(expectedResult.x);
        expect(result.y).toBe(expectedResult.y);
    });
});

import { Acceleration } from '../src/acceleration';
import { Velocity } from '../src/velocity';

describe('Velocity', () => {
    it.each([
        [new Velocity(10, 10), new Acceleration(3, 4), 1, new Velocity(13, 14)],
        [new Velocity(10, 10), new Acceleration(-3, -4), 1, new Velocity(7, 6)],
        [new Velocity(10, 10), new Acceleration(3, 4), 0.5, new Velocity(11.5, 12)],
        [new Velocity(10, 10), new Acceleration(3, 4), 2.5, new Velocity(17.5, 20)]
    ])('accelerate() subject: %p, acceleration: %p, duration: %p, expectedResult: %p', (subject: Velocity, acceleration: Acceleration, duration: number, expectedResult: Velocity) => {
        const result = subject.accelerate(acceleration, duration);
  
        expect(result.x).toBe(expectedResult.x);
        expect(result.y).toBe(expectedResult.y);
    });
});

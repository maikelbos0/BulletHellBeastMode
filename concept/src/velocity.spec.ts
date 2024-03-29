import { Acceleration } from './acceleration';
import { Velocity } from './velocity';

describe('Velocity', () => {
    it.each([
        [new Velocity(10, 10), new Acceleration(3, 4), 1, new Velocity(13, 14)],
        [new Velocity(10, 10), new Acceleration(-3, -4), 1, new Velocity(7, 6)],
        [new Velocity(10, 10), new Acceleration(3, 4), 0.5, new Velocity(11.5, 12)],
        [new Velocity(10, 10), new Acceleration(3, 4), 2.5, new Velocity(17.5, 20)]
    ])('accelerate() subject: %p, acceleration: %p, duration: %p, expectedResult: %p', (subject: Velocity, acceleration: Acceleration, duration: number, expectedResult: Velocity) => {
        const result = subject.accelerate(acceleration, duration);

        expect(result).toEqual(expectedResult);
    });

    it.each([
        [new Velocity(100, 200), 5, new Acceleration(20, 40)],
        [new Velocity(-200, -100), 2, new Acceleration(-100, -50)]
    ])('getAcceleration() subject: %p, duration: %p, expectedResult: %p', (subject: Velocity, duration: number, expectedResult: Acceleration) => {
        const result = subject.getAcceleration(duration);

        expect(result).toEqual(expectedResult);
    });
});

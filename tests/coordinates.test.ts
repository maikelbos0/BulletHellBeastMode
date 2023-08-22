import { Coordinates } from '../src/coordinates';
import { Velocity } from '../src/velocity';

describe('Coordinate', () => {
    it.each([
        [new Coordinates(100, 100), new Velocity(25, 50), 1, new Coordinates(125, 150)],
        [new Coordinates(100, 100), new Velocity(-25, -50), 1, new Coordinates(75, 50)],
        [new Coordinates(100, 100), new Velocity(50, 100), 0.5, new Coordinates(125, 150)],
        [new Coordinates(100, 100), new Velocity(50, 100), 2.5, new Coordinates(225, 350)],
    ])('move() subject: %p, velocity: %p, duration: %p, expectedResult: %p, ', (subject: Coordinates, velocity: Velocity, duration: number, expectedResult: Coordinates) => {
        const result = subject.move(velocity, duration);

        expect(result).toEqual(expectedResult);
    });
});
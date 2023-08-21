import { Coordinate } from '../src/coordinate';
import { Velocity } from '../src/velocity';

describe('Coordinate', () => {
    it.each([
        [new Coordinate(100, 100), new Velocity(25, 50), 1, new Coordinate(125, 150)],
        [new Coordinate(100, 100), new Velocity(-25, -50), 1, new Coordinate(75, 50)],
        [new Coordinate(100, 100), new Velocity(50, 100), 0.5, new Coordinate(125, 150)],
        [new Coordinate(100, 100), new Velocity(50, 100), 2.5, new Coordinate(225, 350)],
    ])('move() subject: %p, vector: %p, duration: %p, expectedResult: %p, ', (subject: Coordinate, velocity: Velocity, duration: number, expectedResult: Coordinate) => {
        const result = subject.move(velocity, duration);

        expect(result.x).toBe(expectedResult.x);
        expect(result.y).toBe(expectedResult.y);
    });
});
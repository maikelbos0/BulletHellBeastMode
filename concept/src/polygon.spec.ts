import { Coordinates } from './coordinates';
import { Polygon } from './polygon';

describe('Polygon', () => {
    it.each([
        [[new Coordinates(-100, -100), new Coordinates(0, 50), new Coordinates(100, -100)], new Coordinates(0, -50)],
        [[new Coordinates(-100, -100), new Coordinates(-100, 100), new Coordinates(100, 100), new Coordinates(100, -100)], new Coordinates(0, 0)],
        [[new Coordinates(100, 100), new Coordinates(200, 100), new Coordinates(200, 150), new Coordinates(100, 350)], new Coordinates(150, 175)]
    ])('constructor() coordinates: %j', (coordinates: Coordinates[], centerPoint: Coordinates) => {
        const subject = new Polygon(...coordinates);

        expect(subject.coordinates).toEqual(coordinates);
        expect(subject.centerPoint).toEqual(centerPoint);
    });

    test('constructor() requires 3 coordinates', () => {
        const action = () => {
            const subject = new Polygon(new Coordinates(0, 0), new Coordinates(100, 100));
          };

          expect(action).toThrow();
    });

    it.each([
        [[new Coordinates(-100, -100), new Coordinates(-100, 100), new Coordinates(-90, -90), new Coordinates(100, -100)]],
        [[new Coordinates(-100, -100), new Coordinates(100, -100), new Coordinates(-90, -90), new Coordinates(-100, 100)]]
    ])('constructor() requires a convex polygon; coordinates: %j', (coordinates: Coordinates[]) => {
        const action = () => {
            const subject = new Polygon(...coordinates);
        };

        expect(action).toThrow();
    });
});
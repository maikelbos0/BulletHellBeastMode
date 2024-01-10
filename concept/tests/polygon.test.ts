import { Coordinates } from '../src/coordinates';
import { Polygon } from '../src/polygon';

describe('Game', () => {
    it.each([
        [[new Coordinates(-100, -100), new Coordinates(0, 50), new Coordinates(100, -100)]],
        [[new Coordinates(-100, -100), new Coordinates(-100, 100), new Coordinates(100, 100), new Coordinates(100, -100)]],
    ])('constructor() points: %j', (points: Coordinates[]) => {
        const subject = new Polygon(new Coordinates(100, 100), ...points);

        expect(subject.anchor).toEqual(new Coordinates(100, 100));
        expect(subject.points).toEqual(points);
    });

    test('constructor() requires 3 points', () => {
        const t = () => {
            const subject = new Polygon(new Coordinates(100, 100), new Coordinates(0, 0), new Coordinates(0, 0));
          };

          expect(t).toThrow();
    });
});
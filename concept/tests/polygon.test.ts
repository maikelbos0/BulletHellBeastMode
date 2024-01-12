import { Coordinates } from '../src/coordinates';
import { Polygon } from '../src/polygon';
import { ShapeGroup } from '../src/shape-group';

describe('Game', () => {
    it.each([
        [[new Coordinates(-100, -100), new Coordinates(0, 50), new Coordinates(100, -100)]],
        [[new Coordinates(-100, -100), new Coordinates(-100, 100), new Coordinates(100, 100), new Coordinates(100, -100)]]
    ])('constructor() coordinates: %j', (coordinates: Coordinates[]) => {
        const shapeGroup = new ShapeGroup(new Coordinates(100, 100));
        const subject = new Polygon(shapeGroup, ...coordinates);

        expect(subject.shapeGroup).toEqual(shapeGroup);
        expect(subject.coordinates).toEqual(coordinates);
    });

    test('constructor() requires 3 coordinates', () => {
        const t = () => {
            const subject = new Polygon(new ShapeGroup(new Coordinates(100, 100)), new Coordinates(0, 0), new Coordinates(0, 0));
          };

          expect(t).toThrow();
    });
});
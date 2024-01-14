import { Coordinates } from './coordinates';
import { Polygon } from './polygon';

describe('Polygon', () => {
    it.each([
        [[new Coordinates(-100, -100), new Coordinates(0, 50), new Coordinates(100, -100)]],
        [[new Coordinates(-100, -100), new Coordinates(-100, 100), new Coordinates(100, 100), new Coordinates(100, -100)]]
    ])('constructor() coordinates: %j', (coordinates: Coordinates[]) => {
        const anchor = { position: new Coordinates(100, 100), polygons: new Array<Polygon>() };
        const subject = new Polygon(anchor, ...coordinates);

        expect(subject.anchor).toEqual(anchor);
        expect(subject.coordinates).toEqual(coordinates);
    });

    test('constructor() requires 3 coordinates', () => {
        const anchor = { position: new Coordinates(100, 100), polygons: new Array<Polygon>() };
        const t = () => {
            const subject = new Polygon(anchor);
          };

          expect(t).toThrow();
    });

    it.each([
        [[new Coordinates(-100, -100), new Coordinates(-100, 100), new Coordinates(-90, -90), new Coordinates(100, -100)]],
        [[new Coordinates(-100, -100), new Coordinates(100, -100), new Coordinates(-90, -90), new Coordinates(-100, 100)]]
    ])('constructor() requires a convex polygon; coordinates: %j', (coordinates: Coordinates[]) => {
        const anchor = { position: new Coordinates(100, 100), polygons: new Array<Polygon>() };
        const t = () => {
            const subject = new Polygon(anchor);
        };

        expect(t).toThrow();
    });
});
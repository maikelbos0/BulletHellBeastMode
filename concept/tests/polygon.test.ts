import { Coordinates } from '../src/coordinates';
import { Polygon } from '../src/polygon';

describe('Game', () => {
    it.each([
        [[new Coordinates(-100, -100), new Coordinates(0, 50), new Coordinates(100, -100)]],
        [[new Coordinates(-100, -100), new Coordinates(-100, 100), new Coordinates(100, 100), new Coordinates(100, -100)]],
    ])('constructor() coordinates: %j', (coordinates: Coordinates[]) => {
        let subject = new Polygon(new Coordinates(100, 100), ...coordinates);

        expect(subject.anchor).toEqual(new Coordinates(100, 100));
        expect(subject.coordinates).toEqual(coordinates);
    });
});
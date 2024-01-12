import { Coordinates } from '../src/coordinates';
import { LineSegment } from '../src/line-segment';

describe('LineSegment', () => {
    it.each([
        [new Coordinates(300, 100), new Coordinates(100, 300), true],
        [new Coordinates(200, 100), new Coordinates(200, 300), true],
        [new Coordinates(300, 200), new Coordinates(100, 200), true],
        [new Coordinates(0, 100), new Coordinates(0, 300), false],
        [new Coordinates(100, 0), new Coordinates(300, 0), false],
        [new Coordinates(0, 200), new Coordinates(100, 200), true]
    ])('intersects() c: %p, d: %p, expectedResult: %p', (c: Coordinates, d: Coordinates, expectedResult: boolean) => {
        const subject = new LineSegment(new Coordinates(100, 100), new Coordinates(300, 300));

        const result = subject.intersectsLine(c, d);

        expect(result).toEqual(expectedResult);
    });

});
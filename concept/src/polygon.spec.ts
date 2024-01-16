import { Coordinates } from './coordinates';
import { Polygon } from './polygon';
import { RenderableTestObject } from '../test/renderable-test-object';

describe('Polygon', () => {
    it.each([
        [[new Coordinates(-100, -100), new Coordinates(0, 50), new Coordinates(100, -100)], new Coordinates(0, -50)],
        [[new Coordinates(-100, -100), new Coordinates(-100, 100), new Coordinates(100, 100), new Coordinates(100, -100)], new Coordinates(0, 0)],
        [[new Coordinates(100, 100), new Coordinates(200, 100), new Coordinates(200, 150), new Coordinates(100, 350)], new Coordinates(150, 175)]
    ])('constructor() coordinates: %j', (coordinates: Coordinates[], centerPoint: Coordinates) => {
        const renderableObject = new RenderableTestObject();
        const subject = new Polygon(renderableObject, ...coordinates);

        expect(subject.renderableObject).toEqual(renderableObject);
        expect(subject.coordinates).toEqual(coordinates);
        expect(subject.centerPoint).toEqual(centerPoint);
    });

    test('constructor() requires 3 coordinates', () => {
        const action = () => {
            const subject = new Polygon(new RenderableTestObject());
          };

          expect(action).toThrow();
    });

    it.each([
        [[new Coordinates(-100, -100), new Coordinates(-100, 100), new Coordinates(-90, -90), new Coordinates(100, -100)]],
        [[new Coordinates(-100, -100), new Coordinates(100, -100), new Coordinates(-90, -90), new Coordinates(-100, 100)]]
    ])('constructor() requires a convex polygon; coordinates: %j', (coordinates: Coordinates[]) => {
        const action = () => {
            const subject = new Polygon(new RenderableTestObject());
        };

        expect(action).toThrow();
    });
});
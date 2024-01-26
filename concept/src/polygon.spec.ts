import { Any } from '../test/any';
import { Mock } from '../test/mock';
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

    test('constructor() requires unique coordinates', () => {
        const action = () => {
            const subject = new Polygon(new Coordinates(0, 0), new Coordinates(100, 100), new Coordinates(200, 200), new Coordinates(100, 100));
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

    test('render() when alive', () => {
        const subject = new Polygon(
            new Coordinates(100, 100),
            new Coordinates(150, 220),
            new Coordinates(200, 100)
        );

        const renderingContextMock = new Mock({
            transform: (func: () => {}) => func(),
            moveTo: () => { },
            lineTo: () => { }
        });

        subject.render(renderingContextMock.object, undefined);

        renderingContextMock.received('moveTo', 200, 100);
        renderingContextMock.received('lineTo', 100, 100);
        renderingContextMock.received('lineTo', 150, 220);
        renderingContextMock.received('lineTo', 200, 100);

        // TODO test did not receive
    });

    test('render() when dead', () => {
        const subject = new Polygon(
            new Coordinates(100, 100),
            new Coordinates(150, 220),
            new Coordinates(200, 100)
        );

        const renderingContextMock = new Mock({
            transform: (func: () => {}) => func(),
            moveTo: () => { },
            lineTo: () => { }
        });

        subject.render(renderingContextMock.object, 1.5);

        renderingContextMock.received(
            'transform',
            Any.function,
            Any.matching({ coordinates: Any.matching({ x: 1068.5587, y: 997.3214 }) }),
            Any.matching({ angle: 1.5 * subject.rotationWhenDead }),
            Any.matching({ factor: 0.4 })
        );
        renderingContextMock.received('moveTo', 50, -40);
        renderingContextMock.received('lineTo', -50, -40);
        renderingContextMock.received('lineTo', 0, 80);
        renderingContextMock.received('lineTo', 50, -40);
    });
});
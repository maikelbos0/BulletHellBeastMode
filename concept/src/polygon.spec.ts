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

        expect(subject.centerPoint).toEqual(centerPoint);
        expect(subject.coordinates).toEqual(coordinates.map(coordinate => coordinate.subtract(centerPoint)));
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

        renderingContextMock.received(
            'transform',
            Any.function,
            Any.matching({ coordinates: Any.matching(subject.centerPoint) })
        );
        
        renderingContextMock.received('moveTo', Any.matching({ x: 50, y: -40 }));
        renderingContextMock.received('lineTo', Any.matching({ x: -50, y: -40 }));
        renderingContextMock.received('lineTo', Any.matching({ x: 0, y: 80 }));
        renderingContextMock.received('lineTo', Any.matching({ x: 50, y: -40 }));
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
            Any.matching({ coordinates: Any.matching(subject.centerPoint.multiply(1 + Math.sqrt(1.5) * subject.driftWhenDead)) }),
            Any.matching({ angle: 1.5 * subject.rotationWhenDead }),
            Any.matching({ factor: 0.4 })
        );
        renderingContextMock.received('moveTo', Any.matching({ x: 50, y: -40 }));
        renderingContextMock.received('lineTo', Any.matching({ x: -50, y: -40 }));
        renderingContextMock.received('lineTo', Any.matching({ x: 0, y: 80 }));
        renderingContextMock.received('lineTo', Any.matching({ x: 50, y: -40 }));
    });
});
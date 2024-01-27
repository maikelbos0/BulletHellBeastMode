import { Color } from './color';
import { Coordinates } from './coordinates';
import { Polygon } from './polygon';
import { RenderableObject } from './renderable-object'
import { Any } from '../test/any';
import { Mock } from '../test/mock';

describe('RenderableObject', () => {
    test('processFrame() when alive', () => {
        const subject = new TestRenderableObject(new Coordinates(100, 100));

        subject.processFrame(5);

        expect(subject.isFrameProcessed).toBeTruthy();
        expect(subject.deadForDuration).toBeUndefined();
    });

    test('processFrame() when dead', () => {
        const subject = new TestRenderableObject(new Coordinates(100, 100));
        subject.deadForDuration = 0;

        subject.processFrame(5);

        expect(subject.isFrameProcessed).toBeTruthy();
        expect(subject.deadForDuration).toBe(5);
    });

    test('render()', () => {
        const subject = new TestRenderableObject(new Coordinates(100, 200));
        const renderingContextMock = new Mock({
            transform: (func: () => {}) => func(),
            path: (func: () => {}) => func(),
            moveTo: () => { },
            lineTo: () => { }
        });

        subject.render(renderingContextMock.object);

        renderingContextMock.received('transform', Any.function, Any.matching({ coordinates: Any.matching({ x: 100, y: 200 }) }));
        renderingContextMock.received('path', Any.function, Any.matching({ stroke: Any.matching({ r: 192, g: 255, b: 32, a: 1 }) }));

        renderingContextMock.received('moveTo', Any.matching({ x: -30, y: -30 }));
        renderingContextMock.received('lineTo', Any.matching({ x: -50, y: -20 }));
        renderingContextMock.received('lineTo', Any.matching({ x: -50, y: 30 }));
        renderingContextMock.received('lineTo', Any.matching({ x: -30, y: -30 }));

        renderingContextMock.received('moveTo', Any.matching({ x: 30, y: -30 }));
        renderingContextMock.received('lineTo', Any.matching({ x: 50, y: -20 }));
        renderingContextMock.received('lineTo', Any.matching({ x: 50, y: 30 }));
        renderingContextMock.received('lineTo', Any.matching({ x: 30, y: -30 }));
    });

    test('kill() when alive', () => {
        const subject = new TestRenderableObject(new Coordinates(100, 100));

        subject.kill();

        expect(subject.deadForDuration).toBe(0);
    });

    test('kill() when dead', () => {
        const subject = new TestRenderableObject(new Coordinates(100, 100));
        subject.deadForDuration = 5;

        subject.kill();

        expect(subject.deadForDuration).toBe(5);
    });
});

class TestRenderableObject extends RenderableObject {
    isFrameProcessed: boolean = false;

    polygons: Polygon[] = [
        new Polygon(
            new Coordinates(-50, -20),
            new Coordinates(-50, 30),
            new Coordinates(-30, -30)
        ),
        new Polygon(
            new Coordinates(50, -20),
            new Coordinates(50, 30),
            new Coordinates(30, -30)
        )
    ];
    color: Color = new Color(192, 255, 32);

    processFrameTransform(_duration: number): void {
        this.isFrameProcessed = true;
    }
}

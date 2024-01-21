import { Any } from '../test/any';
import { Mock } from '../test/mock';
import { Background } from './background';
import { Game } from './game';
import { RenderingOptions } from './rendering-options';

describe('Background', () => {
    test('constructor()', () => {
        const subject = new Background();

        expect(subject.lineHeight).toBe(200);
        expect(subject.offset).toBe(0);
    });

    it.each([
        [0, 0],
        [0.1, 20],
        [0.9, 180],
        [1, 0],
        [2.1, 20],
    ])('processFrame() duration: %p', (duration: number, expectedOffset: number) => {
        const subject = new Background();

        subject.processFrame(duration);

        expect(subject.offset).toEqual(expectedOffset);
    })

    test('render()', () => {
        const subject = new Background();
        subject.offset = 180;

        const renderingContextMock = new Mock({
            rectangle(x0: number, y0: number, x1: number, y1: number, options: RenderingOptions): void { }
        });

        subject.render(renderingContextMock.object);

        renderingContextMock.received('rectangle', 0, subject.offset, Game.width, subject.lineHeight, Any.matching({
            fill: Any.matching({
                x0: 0,
                y0: subject.offset,
                x1: 0,
                y1: subject.offset + subject.lineHeight
            })
        }));

        renderingContextMock.received('rectangle', 0, subject.offset + subject.lineHeight, Game.width, subject.lineHeight, Any.matching({
            fill: Any.matching({
                x0: 0,
                y0: subject.offset + subject.lineHeight,
                x1: 0,
                y1: subject.offset + 2 * subject.lineHeight
            })
        }));
    });
});
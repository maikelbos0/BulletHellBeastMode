import { Background } from './background';

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
});
import { Background } from '../src/background';

describe('Background', () => {
    test('constructor()', () => {
        const subject = new Background(1000, 800);

        expect(subject.width).toBe(1000);
        expect(subject.linePositions).toEqual([0, 160, 320, 480, 640]);
    });

    it.each([
        [0, [0, 160, 320, 480, 640]],
        [1, [200, 360, 520, 680, 40]],
        [2, [400, 560, 720, 80, 240]],
        [0.1, [20, 180, 340, 500, 660]],
    ])('processFrame() duration: %p', (duration: number, expectedLinePositions: number[]) => {
        const subject = new Background(1000, 800);

        subject.processFrame(duration);

        expect(subject.linePositions).toEqual(expectedLinePositions);
    })
});
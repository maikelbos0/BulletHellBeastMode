import { Vector } from '../src/vector';

describe('Vector', () => {
    it.each([
        [3, 4, 5],
        [3, -4, 5],
        [-3, 4, 5],
        [-3, -4, 5]
    ])('getMagnitude() x: %p, y: %p, expectedMagnitude: %p', (x: number, y: number, expectedMagnitude: number) => {
        const subject = new Vector(x, y);

        expect(subject.getMagnitude()).toBe(expectedMagnitude);
    });

    it.each([
        [6, 8, 5, 3, 4],
        [-6, -8, 5, -3, -4],
        [6, 8, 7.5, 4.5, 6],
        [3, 4, 5, 3, 4],
        [3, 4, 7.5, 3, 4]
    ])('limitMagnitude() x: %p, y: %p, maximumMagnitude: %p, expectedX: %p, expectedY: %p', (x: number, y: number, maximumMagnitude: number, expectedX: number, expectedY: number) => {
        const subject = new Vector(x, y);

        const result = subject.limitMagnitude(maximumMagnitude);

        expect(result.x).toBe(expectedX);
        expect(result.y).toBe(expectedY);
    });
});

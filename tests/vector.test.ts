import { Vector } from '../src/vector';

describe('Vector', () => {
    it.each([
        [new Vector(3, 4), 5],
        [new Vector(3, -4), 5],
        [new Vector(-3, 4), 5],
        [new Vector(-3, -4), 5]
    ])('getMagnitude() subject: %p, expectedResult: %p', (subject: Vector, expectedResult: number) => {
        expect(subject.getMagnitude()).toBe(expectedResult);
    });

    it.each([
        [new Vector(6, 8), 5, new Vector(3, 4)],
        [new Vector(-6, -8), 5, new Vector(-3, -4)],
        [new Vector(6, 8), 7.5, new Vector(4.5, 6)],
        [new Vector(3, 4), 5, new Vector(3, 4)],
        [new Vector(3, 4), 7.5, new Vector(3, 4)]
    ])('limitMagnitude() subject: %p, maximumMagnitude: %p, expectedResult: %p', (subject: Vector, maximumMagnitude: number, expectedResult: Vector) => {
        const result = subject.limitMagnitude(maximumMagnitude);

        expect(result.x).toBe(expectedResult.x);
        expect(result.y).toBe(expectedResult.y);
    });
});

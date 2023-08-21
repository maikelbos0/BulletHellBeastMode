import { Vector } from '../src/vector';

describe('Vector', () => {
    it.each([
        [new Vector(3, 4), 5],
        [new Vector(3, -4), 5],
        [new Vector(-3, 4), 5],
        [new Vector(-3, -4), 5]
    ])('getMagnitude() subject: %p, expectedMagnitude: %p', (subject: Vector, expectedMagnitude: number) => {
        expect(subject.getMagnitude()).toBe(expectedMagnitude);
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

    it.each([
        [new Vector(10, 10), new Vector(3, 4), new Vector(13, 14)],
        [new Vector(10, 10), new Vector(3, -4), new Vector(13, 6)],
        [new Vector(10, 10), new Vector(-3, 4), new Vector(7, 14)],
        [new Vector(10, 10), new Vector(-3, -4), new Vector(7, 6)]
    ])('getMagnitude() subject: %p, expectedMagnitude: %p', (subject: Vector, vector: Vector, expectedResult: Vector) => {
        const result = subject.add(vector);
        
        expect(result.x).toBe(expectedResult.x);
        expect(result.y).toBe(expectedResult.y);
    });
});

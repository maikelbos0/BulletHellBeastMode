import { Vector } from '../src/vector';

describe('Vector', () => {
    it.each([
        [1, 2, 1, 2],
        [1.1115, 2.1115, 1.1115, 2.1115],
        [1.11154, 2.11154, 1.1115, 2.1115],
        [1.11156, 2.11156, 1.1116, 2.1116]
    ])('constructor() x: %p, y: %p, expectedX: %p, expectedY: %p', (x: number, y: number, expectedX: number, expectedY: number) => {
        const result = new Vector(x, y);

        expect(result.x).toBe(expectedX);
        expect(result.y).toBe(expectedY);
    });

    it.each([
        [new Vector(0, 0), false],
        [new Vector(4, 0), true],
        [new Vector(0, 3), true],
        [new Vector(4, 3), true]
    ])('hasMagnitude() subject: %p, expectedResult: %p', (subject: Vector, expectedResult: boolean) => {
        expect(subject.hasMagnitude()).toBe(expectedResult);
    });

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

        expect(result).toEqual(expectedResult);
    });

    it.each([
        [new Vector(6, 8), 5, new Vector(3, 4)],
        [new Vector(-6, -8), 5, new Vector(-3, -4)],
        [new Vector(6, 8), 7.5, new Vector(4.5, 6)],
        [new Vector(6, 8), 10, new Vector(6, 8)],
        [new Vector(6, 8), 15, new Vector(9, 12)],
    ])('adjustMagnitude() subject: %p, newMagnitude: %p, expectedResult: %p', (subject: Vector, newMagnitude: number, expectedResult: Vector) => {
        const result = subject.adjustMagnitude(newMagnitude);

        expect(result).toEqual(expectedResult);
    });

    it.each([
        [new Vector(10, 10), new Vector(3, 4), new Vector(13, 14)],
        [new Vector(10, 10), new Vector(-3, -4), new Vector(7, 6)]
    ])('add() subject: %p, vector: %p, expectedResult: %p', (subject: Vector, vector: Vector, expectedResult: Vector) => {
        const result = subject.add(vector);

        expect(result).toEqual(expectedResult);
    });

    it.each([
        [new Vector(10, 10), new Vector(3, 4), new Vector(7, 6)],
        [new Vector(10, 10), new Vector(-3, -4), new Vector(13, 14)]
    ])('subtract() subject: %p, vector: %p, expectedResult: %p', (subject: Vector, vector: Vector, expectedResult: Vector) => {
        const result = subject.subtract(vector);

        expect(result).toEqual(expectedResult);
    });
});

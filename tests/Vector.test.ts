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
});

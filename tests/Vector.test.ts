import { Vector } from '../src/vector';

describe('Vector', () => {
    test('getSpeed', () => {
        const subject = new Vector(3, 4);

        expect(subject.getSpeed()).toBe(5);
    });
});

import { Color } from './color';

describe('Color', () => {
    it.each([
        [undefined, 'rgba(255, 192, 32, 1)'],
        [1, 'rgba(255, 192, 32, 1)'],
        [0.5, 'rgba(255, 192, 32, 0.5)'],
        [0, 'rgba(255, 192, 32, 0)'],
    ])('toRgba() alpha: %p, expectedResult: %p', (alpha: number | undefined, expectedResult: string) => {
        const subject = new Color(255, 192, 32);
        const result = subject.toRgba(alpha);

        expect(result).toEqual(expectedResult);
    });
});

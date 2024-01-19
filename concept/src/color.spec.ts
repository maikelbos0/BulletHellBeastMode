import { Color } from './color';

describe('Color', () => {
    test('withAlpha()', () => {
        const subject = new Color(255, 192, 32);

        const result = subject.withAlpha(0.5);

        expect(result).toEqual(new Color(255, 192, 32, 0.5));
        expect(subject.a).toEqual(1);
    });

    it.each([
        [255, 192, 32, undefined, 'rgba(255, 192, 32, 1)'],
        [255, 192, 32, 1, 'rgba(255, 192, 32, 1)'],
        [255, 192, 32, 0.5, 'rgba(255, 192, 32, 0.5)'],
        [255, 192, 32, 0, 'rgba(255, 192, 32, 0)'],
    ])('toCanvasStyle() r: %p, g: %p, b: %p, alpha: %p, expectedResult: %p', (r: number, g: number, b: number, a: number | undefined, expectedResult: string) => {
        const subject = new Color(r, g, b, a);

        const result = subject.toCanvasStyle({} as CanvasRenderingContext2D);

        expect(result).toEqual(expectedResult);
    });

});

import { Color } from './color';
import { Gradient } from './gradient';

describe('Gradient', () => {
    test('toCanvasStyle()', () => {
        const subject = new Gradient(10, 20, 210, 420);
        const colorStops = new Array<{ offset: number, color: string }>();

        subject.addColorStop(0, new Color(255, 192, 32));
        subject.addColorStop(0.5, new Color(0, 0, 0));
        subject.addColorStop(1, new Color(32, 192, 255));

        const result = subject.toCanvasStyle({
            createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
                return {
                    x0,
                    y0,
                    x1,
                    y1,
                    addColorStop(offset: number, color: string): void {
                        colorStops.push({ offset, color });
                    }
                } as CanvasGradient;
            }
        } as unknown as CanvasRenderingContext2D);

        expect(result).toMatchObject({
            x0: 10,
            y0: 20,
            x1: 210,
            y1: 420
        });

        expect(colorStops).toEqual([
            { offset: 0, color: 'rgba(255, 192, 32, 1)' },
            { offset: 0.5, color: 'rgba(0, 0, 0, 1)' },
            { offset: 1, color: 'rgba(32, 192, 255, 1)' }
        ]);
    });
});

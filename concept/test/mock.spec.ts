import { Mock } from './mock';
import { Any } from './any';

describe('Mock', () => {
    test('constructor() creates properties', () => {
        const subject = new Mock({
            value: 10
        });

        expect(subject.object).toBeTruthy();
        expect(subject.object.value).toBe(10);
    });

    test('constructor() creates methods', () => {
        const subject = new Mock({
            multiply(x: number, y: number): number{
                return x * y;
            }
        });

        expect(subject.object).toBeTruthy();
        expect(typeof subject.object.multiply).toBe('function');
        expect(subject.object.multiply(3, 4)).toBe(12);
    });

    it.each([
        [Any.value, Any.value],
        [3, 4],
    ])('received() x: %p, y: %p', (x: any, y: any) => {
        const subject = new Mock({
            multiply(x: number, y: number): number {
                return x * y;
            }
        });

        subject.object.multiply(3, 4);

        subject.received('multiply', x, y);
    });

    it.each([
        [Any.value, 5],
        [3, 5],
    ])('received() requires method to have been called x: %p, y: %p', (x: any, y: any) => {
        const subject = new Mock({
            multiply(x: number, y: number): number {
                return x * y;
            }
        });

        subject.object.multiply(3, 4);
        
        const action = () => {
            subject.received('multiply', x, y);
        };

        expect(action).toThrow();
    });

    it.each([
        [Any.value, 5],
        [3, 5],
    ])('didNotReceive() x: %p, y: %p', (x: any, y: any) => {
        const subject = new Mock({
            multiply(x: number, y: number): number {
                return x * y;
            }
        });

        subject.object.multiply(3, 4);

        subject.didNotReceive('multiply', x, y);
    });

    it.each([
        [Any.value, Any.value],
        [3, 4],
    ])('didNotReceive() requires method not to have been called x: %p, y: %p', (x: any, y: any) => {
        const subject = new Mock({
            multiply(x: number, y: number): number {
                return x * y;
            }
        });

        subject.object.multiply(3, 4);
        
        const action = () => {
            subject.didNotReceive('multiply', x, y);
        };

        expect(action).toThrow();
    });
});
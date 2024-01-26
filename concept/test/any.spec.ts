import { Any } from './any';

describe('Any', () => {
    it.each([
        [undefined],
        [null],
        ['Foo'],
        [42],
    ])('value value: %p', (value: any) => {
        expect(Any.value.matches(value)).toBeTruthy();
    });

    it.each([
        [() => { }, true],
        [(value: any) => value, true],
        [undefined, false],
        [null, false],
        [42, false]
    ])('function value: %p, expectedResult: %p', (value: any, expectedResult: boolean) => {
        expect(Any.function.matches(value)).toBe(expectedResult);
    });
    
    it.each([
        [{ foo: 1 }, { foo: 1 }, true],
        [{ foo: 1 }, { foo: 2 }, false],
        [{ foo: 1 }, { bar: 1 }, false],
        [{ foo: 1, bar: 'yes' }, { foo: 1 }, true],
        [{ foo: 1 }, { foo: Any.value }, true],
        [null, { foo: Any.value }, false],
        [undefined, { foo: Any.value }, false]
    ])('matching() value %p, argument: %p, expectedResult: %p', (value: any, argument: any, expectedResult: boolean) => {
        expect(Any.matching(argument).matches(value)).toBe(expectedResult);
    });
});
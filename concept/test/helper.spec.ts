import { Any } from "./any";
import { Helper } from "./helper";


describe('Helper', () => {
    it.each([
        [0, "0"],
        [42, "42"],
        ["Foo", "Foo"],
        [{ x: 42, y: "Foo" }, "{ x: 42, y: Foo }"],
        [Any.value, "Any.value"],
        [Any.matching({ x: 42, y: Any.value, z: Any.matching({ test: "Baz" }) }), "Any.matching({ x: 42, y: Any.value, z: Any.matching({ test: Baz }) })"],
    ])('stringify() value: %p, expectedResult: %p', (value: any, expectedResult: string) => {
        expect(Helper.stringify(value)).toEqual(expectedResult);
    });
});
import { Helper } from "./helper";

export class Any {
    static readonly value: Any = new Any((_expectedValue: any) => true, 'Any.value');

    static readonly function: Any = new Any((expectedValue: any) => typeof expectedValue === 'function', 'Any.function');

    static matching(expectedValue: any) {
        return new Any(
            (value: any) => {
                if (!value) {
                    return false;
                }

                for (let key in expectedValue) {
                    if (!Any.equals(value[key], expectedValue[key])) {
                        return false;
                    }
                }

                return true;
            },
            `Any.matching(${Helper.stringify(expectedValue)})`
        );
    }

    static equals(value: any, expectedValue: any): boolean {
        return value === expectedValue || (typeof expectedValue['matches'] === 'function' && expectedValue['matches'](value));
    }

    constructor(readonly matches: (value: any) => boolean, readonly stringRepresentation: string) { }

    toString(): string {
        return this.stringRepresentation;
    }
}

export class Any {
    static readonly value: Any = new Any((_value: any) => true);

    static readonly function: Any = new Any((value: any) => typeof value === 'function');

    static matching(argument: any) {
        return new Any((value: any) => {
            if (!value) {
                return false;
            }

            for (let key in argument) {
                if (value[key] !== argument[key] && !(typeof argument[key]['matches'] === 'function' && (argument[key] as Any).matches(value[key]))) {
                    return false;
                }
            }

            return true;
        });
    }

    constructor(readonly matches: (value: any) => boolean) { }
}

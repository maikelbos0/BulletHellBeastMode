export class Helper {
    static stringify(value: any): string {
        if ((value && typeof value["matches"] === 'function') || !(value && typeof value === 'object')) {
            return value.toString();
        }

        const properties: string[] = [];

        for (let key in value) {
            properties.push(`${key}: ${this.stringify(value[key])}`);
        }

        return `{ ${properties.join(', ')} }`;
    }
}

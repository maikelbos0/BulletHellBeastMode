import { Any } from "./any";

export class Mock {
    methodCalls = new Map<string, any[][]>();
    object: any = {
        mock: this
    };

    constructor(template: any) {
        for (let key in template) {
            if (typeof template[key] === 'function') {
                this.object[key] = (...args: any[]) => {
                    const receivedArgs = this.methodCalls.get(key);

                    if (receivedArgs) {
                        receivedArgs.push(args);
                    }
                    else {
                        this.methodCalls.set(key, [args]);
                    }

                    return template[key](...args);
                }
            }
            else {
                this.object[key] = template[key];
            }
        }
    }

    received(methodName: string, ...args: any[]) {
        if (this.getMethodCallCount(methodName, args) !== 1) {
            // TODO serialize
            throw new Error(`No matching calls found: ${methodName}(${args.join(', ')});`);
        }
    }

    didNotReceive(methodName: string, ...args: any[]) {
        if (this.getMethodCallCount(methodName, args) !== 0) {
            // TODO serialize
            throw new Error(`Matching calls found: ${methodName}(${args.join(', ')});`);
        }
    }

    getMethodCallCount(methodName: string, args: any[]): number {
        const allReceivedArgs = this.methodCalls.get(methodName);
        let count = 0;

        allReceivedArgs?.forEach((receivedArgs) => {
            if (receivedArgs.length !== args.length) {
                return;
            }

            for (let i = 0; i < args.length; i++) {
                if (receivedArgs[i] !== args[i] && !(typeof args[i]['matches'] === 'function' && (args[i] as Any).matches(receivedArgs[i]))) {
                    return;
                }
            }

            count++;
        });

        return count;
    }
}

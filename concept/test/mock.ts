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

    // TODO rename
    received(methodName: string, ...args: any[]) {
        const methodCallCount = this.getMethodCallCount(methodName, args);

        if (methodCallCount !== 1) {
            // TODO serialize
            throw new Error(`Expected exactly 1 call matching ${methodName}(${args.join(', ')}) but found ${methodCallCount}`);
        }
    }

    didNotReceive(methodName: string, ...args: any[]) {
        const methodCallCount = this.getMethodCallCount(methodName, args);

        if (methodCallCount !== 0) {
            // TODO serialize
            throw new Error(`Expected no calls matching ${methodName}(${args.join(', ')}) but found ${methodCallCount}`);
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
                if (!Any.equals(receivedArgs[i], args[i])) {
                    return;
                }
            }

            count++;
        });

        return count;
    }
}

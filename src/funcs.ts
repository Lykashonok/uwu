export function parseQuery(query: string) {
    let variables = query.substring(1).split('&');
    let result: {
        [key: string]: string
    } = {};
    variables.forEach(element => {
        let pair = element.split('=');
        if (pair.length > 0) {
            result[pair[0]] = pair[1];
        }
    });
    return result;
}

export function isObject(variable: any): boolean {
    return (typeof variable === 'object' &&
        !Array.isArray(variable) &&
        variable !== null);
}

export function guid(): string {
    // 00000000-0000-0000-0000-000000000000
    function f() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
    }
    return `${f()}${f()}-${f()}-${f()}-${f()}-${f()}${f()}${f()}`;
};

// function watch(value: any, name: any) {
//     // create handler for proxy
//     const handler = new Proxy({
//         apply(target: any, thisArg: any, argsList: any) : any[] {
//             // something was invoked, so return custom array
//             return [value, name, receiver, argsList];
//         },
//         get(target: any, property: PropertyKey) : any {
//             // a property was accessed, so wrap it in a proxy if possible
//             const {
//                 writable,
//                 configurable
//             } = Object.getOwnPropertyDescriptor(target, property) || { configurable: true };
//             return writable || configurable
//                 ? watch(value === object ? value[property.toString()] : undefined, property)
//                 : target[property.toString()];
//         }
//     }, {
//         get(handler : any, trap : any) {
//             if (trap in handler) {
//                 return handler[trap];
//             }
//             // reflect intercepted traps as if operating on original value
//             return (target: any, ...args: any) => (Reflect as any)[trap].call(handler, value, ...args);
//         }
//     });

//     // coerce to object if value is primitive
//     const object = Object(value);
//     // create callable target without any own properties
//     const target = () => { };
//     target.length = 0;
//     target.name = '';
//     // set target to deep clone of object
//     Object.setPrototypeOf(
//         Object.defineProperties(target, Object.getOwnPropertyDescriptors(object)),
//         Object.getPrototypeOf(object)
//     );
//     // create proxy of target
//     const receiver = new Proxy(target, handler);

//     return receiver;
// }

export function observe(obj: any, fn: Function): ProxyConstructor {
    return new Proxy(obj, {
        set(obj, key, val) {
            obj[key] = val;
            fn(obj);
            return true;
        },
        get(target, p, reciever) {
            console.log(target, p, reciever);
            return Reflect.get(target, p, reciever);
        }
    });
};

export function observeArray<T>(obj: Array<T>, action: Function): ProxyConstructor {
    const push = obj.push.bind(obj);
    obj.push = (...args: any[]) => {
        const res = push(...args);
        action(obj);
        return res
    };
    const slice = obj.slice.bind(obj);
    obj.slice = (...args: any[]) => {
        const res = slice(...args);
        action(obj);
        return res
    };
    const shift = obj.shift.bind(obj);
    obj.shift = () => {
        const res = shift();
        action(obj);
        return res
    };
    const pop = obj.pop.bind(obj);
    obj.pop = () => {
        const res = pop();
        action(obj);
        return res
    };
    return observe(obj, action);
}
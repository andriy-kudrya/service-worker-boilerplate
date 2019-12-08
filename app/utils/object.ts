function assignFallback<T extends object, U>(target: T, source: U): T & U
function assignFallback<T extends object, U, V>(target: T, source1: U, source2: V): T & U & V
function assignFallback<T extends object, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W
function assignFallback<T extends object>(target: T, ...sources: any[]): any
function assignFallback(target: any, ...sources: any[]): any {
    if (target == null)
        throw new TypeError('Cannot convert undefined or null to object')

    sources.filter(_ => _ != null).forEach(object => {
        Object.keys(object).forEach(
            key => target[key] = object[key]
        )
    })

    return target
}

const assign: typeof assignFallback = (Object as any).assign || assignFallback

function omit<T extends object, F extends keyof T>(target: T, ...fields: F[]): Omit<T, F> {
    const result = assign({}, target)
    fields.forEach(_ => delete result[_])
    return result
}

function shallowUpdate<T extends object>(object: T, ...update: Partial<T>[]): T {
    return assign({}, object, ...update)
}

function pick<T, K extends keyof T>(target: T, ...keys: K[]): Pick<T, K> {
    const result: any = {}
    keys.forEach(_ => result[_] = target[_])
    return result
}

export { assign, shallowUpdate, pick, omit }

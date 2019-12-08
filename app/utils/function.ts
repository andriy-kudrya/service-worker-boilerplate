function noop(): void {}

function id<T>(value: T): T {
    return value
}

type Func<T extends any[], R, C = unknown> = (this: C, ...args: T) => R

function memoizeLatestCall<T extends any[], R, C = unknown>(f: Func<T, R, C>): Func<T, R, C> {
    let latestArgs: T
      , latestContext: C
      , latestResult: R

    return function (...args) {
        if (latestArgs && args.length === latestArgs.length && this === latestContext) {
            let isEqual = true
            for (let i = 0, length = args.length; i < length && isEqual; i++)
                isEqual = isEqual && args[i] === latestArgs[i]

            if (isEqual)
                return latestResult
        }

        latestResult = f.apply(this, args)
        latestArgs = args
        latestContext = this

        return latestResult
    }
}

export { Func, noop, id, memoizeLatestCall }

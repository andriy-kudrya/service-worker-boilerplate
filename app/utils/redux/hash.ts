interface Hash<T> {
    set(key: string, value: T): void
    get(key: string): T | undefined
    has(key: string): boolean
}

function createHash<T>(): Hash<T> {
    const hash: { [key: string]: T | undefined } = {}

    return {
        set(key, value) {
            hash[key] = value
        },
        get(key) {
            return hash[key]
        },
        has(key) {
            return key in hash
        },
    }
}

export default createHash

export const trace: <T>(_: T) => T =
    v => (console.log(JSON.stringify(v, null, 2)), v) // eslint-disable-line no-console

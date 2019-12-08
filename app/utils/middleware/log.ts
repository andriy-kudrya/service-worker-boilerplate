import { Middleware } from 'redux'

const log: Middleware = _api => next => action => {
    const result = next(action)

    // eslint-disable-next-line
    // console.log('store', action)

    return result
}

export default log

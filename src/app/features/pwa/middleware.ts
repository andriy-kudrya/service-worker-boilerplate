import { Middleware } from '#/utils/redux'
import AppState from '#/model/app-state'
import Pwa from '#/model/pwa/pwa'

function factory(pwa: Pwa): Middleware<AppState> {
    return _api => {
        pwa.register()

        return next => action => next(action)
    }
}

export default factory

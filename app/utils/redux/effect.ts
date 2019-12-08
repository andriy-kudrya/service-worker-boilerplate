import { ActionType, HasActionType, Dispatch, Middleware, NoInfer } from './types'
import { isPayloadAction } from './action'

import createHash from './hash'

type Handler<P, R> = (payload: P) => R

interface EffectHandler<P, R> {
    actionType: ActionType<P, R>
    handler: Handler<P, R>
}

function handler<P, R>(creator: HasActionType<P, R>, handler: Handler<NoInfer<P>, NoInfer<R>>): EffectHandler<P, R> {
    return { actionType: creator.type, handler }
}

function effectMiddlewareFactory<S>(...effectsFactories: EffectsFactory<S>[]): Middleware<S> {
    return api => {
        const map = createHash<Handler<any, any>>()

        effectsFactories.forEach(
            factory =>
                factory(api.dispatch, api.getState).forEach(_ => {
                    if (map.has(_.actionType))
                        throw Error(`Action ${_.actionType} handler has been registered already`)

                    map.set(_.actionType, _.handler)
                })
        )

        return next => action => {
            const handler = map.get(action.type) as any

            if (!handler)
                return next(action)

            return isPayloadAction(action) ? handler(action.payload) : handler()
        }
    }
}

interface EffectsFactory<S> {
    (dispatch: Dispatch, getState: () => S): EffectHandler<any, any>[]
}

export { effectMiddlewareFactory as default, handler, EffectsFactory }

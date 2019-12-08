import { Reducer } from 'redux'

import createHash from './hash'

import { ActionType, HasActionType, Action, NoInfer } from './types'
import { isPayloadAction } from './action'

// TODO: type inference doesn't work for ActionType<void> when creating reducer with *reducer* factory below
// type Handler<S, P> = P extends void
//     ? (state: S) => S
//     : (state: S, payload: P) => S
type Handler<S, P> = (state: S, payload: P) => S

interface ActionHandler<S, P, R> {
    actionType: ActionType<P, R>
    handler: Handler<S, P>
}

function handler<S, P, R>(creator: HasActionType<P, R>, handler: Handler<NoInfer<S>, NoInfer<P>>): ActionHandler<S, P, R> {
    return { actionType: creator.type, handler }
}

function reducer<S>(defaultState: S, ...payloadHandlers: ActionHandler<S, any, any>[]): Reducer<S> {
    const handlerMap = createHash<Handler<S, any>>()
    payloadHandlers.forEach(_ => {
        if (handlerMap.has(_.actionType))
            throw Error(`Action ${_.actionType} handler has been registered already`)

        handlerMap.set(_.actionType, _.handler)
    })

    return (state = defaultState, action: Action<any, any> | Action<void, any>) => {
        const handler = handlerMap.get(action.type) as any

        if (handler)
            return isPayloadAction(action) ? handler(state, action.payload) : handler(state)

        return state
    }
}

export { handler, reducer }

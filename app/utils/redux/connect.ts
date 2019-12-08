import { compose } from 'redux'
import { useCallback } from 'react'
import { Func } from '../function'
import { HasActionType } from './types'
import { useDispatch } from './context'

type ActionCreator<T extends any[] = any[], R = any> = Func<T, HasActionType<any, R>>

// let it be for now in case I want to switch back to react-redux

// type MappedDispatch<F extends ActionCreator> =
//     F extends ActionCreator<infer T, infer R> ? Func<T, R> : never

// interface ActionCreatorHash {
//     [_: string]: ActionCreator
// }

// type DispatchHash<T extends ActionCreatorHash> = {
//     [P in keyof T]: MappedDispatch<T[P]>
// }

// function dispatchMapper<H extends ActionCreatorHash>(hash: H) {
//     return function (dispatch: any): DispatchHash<H> {
//         return Object.keys(hash).reduce(
//             (acc, prop) => {
//                 acc[prop] = compose(dispatch, hash[prop])
//                 return acc
//             },
//             {} as any
//         )
//     }
// }

// NOTE: case when R extends Default is not handled but that result is not useful anyway
// same applies to dispatchMapper above
function useAction<T extends any[], R>(action: ActionCreator<T, R>): Func<T, R> {
    const dispatch = useDispatch()
        , composedDispatch = useCallback(compose(dispatch, action), [dispatch, action])

    return composedDispatch as any
}

export {
    // dispatchMapper,
    useAction,
}

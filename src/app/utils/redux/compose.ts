import { Dispatch as CustomDispatch, NoPayloadAction, PayloadAction } from './types'

export { compose } from 'redux'

declare module 'redux' {
    export function compose<R>(dispatch: CustomDispatch, actionCreator: () => NoPayloadAction<R>): () => R
    export function compose<P, R>(dispatch: CustomDispatch, actionCreator: (payload: P) => PayloadAction<P, R>): (payload: P) => R
}

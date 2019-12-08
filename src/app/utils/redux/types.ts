/**
 * @param P Payload type
 * @param R Result type of "dispatch" function when action of this type is dispatched.
 */
type ActionType<P, R> = string & {
    attachPayloadTypeHack?: P
    attachDispatchResultTypeHack?: R
}

interface HasActionType<P, R> {
    type: ActionType<P, R>
}

interface NoPayloadAction<R> extends HasActionType<void, R> {}

interface PayloadAction<P, R> extends HasActionType<P, R> {
    type: ActionType<P, R>
    payload: P
}

type Action<P, R> = [P] extends [void] ? NoPayloadAction<R> : PayloadAction<P, R>

// Type inference does not work with conditional types
// so overloaded dispatch is used instead of single parameter Action<P, R>
// https://github.com/Microsoft/TypeScript/issues/25301
interface Dispatch {
    <R>(action: NoPayloadAction<R>): R
    <P, R>(action: PayloadAction<P, R>): R
}

interface MiddlewareAPI<S> {
    dispatch: Dispatch
    getState(): S
}

interface Middleware<S> {
    (api: MiddlewareAPI<S>): (next: Dispatch) => (action: any) => any
    // (api: MiddlewareAPI<S>): (next: Dispatch) => <P, R>(action: Action<P, R>) => DispatchResult<P, R>
    // (api: MiddlewareAPI<S>): (next: Dispatch) => Dispatch
}

// https://github.com/Microsoft/TypeScript/issues/14829#issuecomment-322267089
// Used only in redux utils as of now
// Otherwise should be moved to common module
type NoInfer<T> = T & {[K in keyof T]: T[K]}

export {
    ActionType,
    Action,
    HasActionType,
    NoPayloadAction,
    PayloadAction,
    Dispatch,
    MiddlewareAPI,
    Middleware,
    NoInfer,
}

import { Store, AnyAction } from 'redux'
import * as React from 'react'
import { useContext } from 'react'
import useSubscription from '../react/use-subscription'
import { Dispatch } from './types'

const Context = React.createContext<Store | undefined>(undefined)

function useStore<T>(): Store<T> {
    const store = useContext(Context)

    if (store === undefined)
        throw new Error('store is not provided')

    return store
}

const strictEqual = <T>(one: T, two: T) => one === two
    , subscribe = <S>(store: Store<S, AnyAction>, callback: () => void) => store.subscribe(callback)
    , getState = <S>(store: Store<S, AnyAction>) => store.getState()

function useSelector<S, T>(selector: (state: S) => T, equal: (one: T, two: T) => boolean = strictEqual): T {
    const store = useStore<S>()
        , state = useSubscription(store, subscribe, getState, equal, selector)

    return state
}

function useDispatch(): Dispatch {
    const store = useStore<any>()
    return store.dispatch
}

export default Context
export { useSelector, useDispatch }

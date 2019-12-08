import { useEffect, useRef } from 'react'
import useForceUpdate from './use-force-update'

const strictEqual = <T>(one: T, two: T) => one === two

/**
 * Tracks changes to subscribed value
 * Something in-between of:
 * - https://github.com/facebook/react/blob/master/packages/use-subscription/src/useSubscription.js
 * - https://github.com/reduxjs/react-redux/blob/2eac86163be2bd5627dab3e33e8b4e0926895442/src/hooks/useSelector.js
 * @param subject
 * @param getCurrentValue
 * @param subscribe
 * @param equal
 */
function useSubscription<S, T>(
    subject: S,
    subscribe: (subject: S, callback: () => void) => () => void,
    getCurrentValue: (subject: S) => T,
    equal?: (one: any, two: any) => boolean,
): T
function useSubscription<S, T, M = T>(
    subject: S,
    subscribe: (subject: S, callback: () => void) => () => void,
    getCurrentValue: (subject: S) => T,
    equal?: (one: any, two: any) => boolean,
    mapValue?: (value: T) => M
): M
function useSubscription<S, T, M = T>(
    subject: S,
    subscribe: (subject: S, callback: () => void) => () => void,
    getCurrentValue: (subject: S) => T,
    equal: (one: any, two: any) => boolean = strictEqual,
    mapValue?: (value: T) => M
): M {
    type State = {
        currentValue: T | M
        getCurrentValue: typeof getCurrentValue
        mapValue: typeof mapValue
        equal: typeof equal
    }

    const forceUpdate = useForceUpdate()
        , stateRef = useRef<State>()
        , state = stateRef.current
        , uncommittedValue = state && state.getCurrentValue === getCurrentValue && state.mapValue === mapValue
            ? state.currentValue
            : mapValue
                ? mapValue(getCurrentValue(subject))
                : getCurrentValue(subject)

    useEffect(
        () => {
            stateRef.current = {
                currentValue: uncommittedValue,
                getCurrentValue,
                mapValue,
                equal,
            }
        }
    )

    useEffect(
        () => {
            let disposed = false

            const handleChange = () => {
                if (disposed)
                    return

                const state = stateRef.current!
                    , nextValue = state.mapValue ? state.mapValue(state.getCurrentValue(subject)) : state.getCurrentValue(subject)

                if (state.equal(nextValue, state.currentValue))
                    return

                state.currentValue = nextValue
                forceUpdate()
            }

            handleChange()

            const dispose = subscribe(subject, handleChange)
            return () => {
                disposed = true
                dispose()
            }
        },
        // no need to include 'forceUpdate' dependency but eslint is complaining
        [subject, subscribe, forceUpdate]
    )

    return uncommittedValue as any
}

export default useSubscription

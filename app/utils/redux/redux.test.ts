import * as redux from 'redux'

import { shallowUpdate } from '../object'
import { noop } from '../function'
import { creatorFactory } from './action'
import { reducer, handler } from './reducer'
import effectsMiddlewareFactory, { EffectsFactory, handler as effectHandler } from './effect'

describe('redux', function () {
    const creator = creatorFactory('test')

    describe('reducer', function () {
        interface State {
            one: number
            two: number
        }

        const actionOne = creator<number>('ACTION_ONE')
            , defaultState: State = {
                one: 1,
                two: 2,
            }

        Object.freeze(defaultState)

        it('should return default state after unknown action when state is not supplied', function () {
            const reduce = reducer(
                    defaultState,
                    handler(actionOne, (state, payload) => shallowUpdate(state, { one: payload }))
                )

            const result = reduce(undefined, { type: 'unknown' })

            expect(result).toEqual(defaultState)
        })

        it('should preserve current state after unknown action', function () {
            const reduce = reducer(
                    defaultState,
                    handler(actionOne, (state, payload) => shallowUpdate(state, { one: payload }))
                )
                , currentState = reduce(undefined, actionOne(5))

            const result = reduce(currentState, { type: 'unknown' })

            expect(result).toEqual(currentState)
        })

        it('should delegate action to handler', function () {
            const reduce = reducer(
                    defaultState,
                    handler(actionOne, (state, payload) => shallowUpdate(state, { one: payload }))
                )

            const result = reduce(undefined, actionOne(5))

            expect(result).toEqual({ one: 5, two: 2 })
        })

        it('should throw when second handler is registered for same action type', function () {
            const createReducer = () =>
                reducer(
                    defaultState,
                    handler(actionOne, _ => _),
                    handler(actionOne, _ => _)
                )

            expect(createReducer).toThrow()
        })
    })

    describe('effectsMiddlewareFactory', function () {
        const actionOne = creator<string, void>('ACTION_ONE')
            , actionTwo = creator<string, void>('ACTION_TWO')

        function createStore<S>(...effects: EffectsFactory<S>[]) {
            const mw = effectsMiddlewareFactory(...effects)
            return redux.createStore(_ => ({}), redux.applyMiddleware(mw))
        }

        it('forbids for same effects factory to have several handlers for same action', function () {
            const effects: EffectsFactory<{}> = () => [
                    effectHandler(actionOne, noop),
                    effectHandler(actionOne, noop),
                ]

            expect(() => createStore(effects)).toThrow()
        })

        it('allows for same effects factory to have distinct action handlers', function () {
            const effects: EffectsFactory<{}> = () => [
                    effectHandler(actionOne, noop),
                    effectHandler(actionTwo, noop),
                ]

            expect(() => createStore(effects)).not.toThrow()
        })

        it('produces side effect when action for registered handler is dispatched', function () {
            let effectTarget = 'initial'
            const effects: EffectsFactory<{}> = () => [
                    effectHandler(actionOne, _ => { effectTarget = _ }),
                ]
                , store = createStore(effects)

            store.dispatch(actionOne('modified'))

            expect(effectTarget).toBe('modified')
        })

        it('should not produce side effect when action for not registered handler is dispatched', function () {
            let effectTarget = 'initial'
            const effects: EffectsFactory<{}> = () => [
                    effectHandler(actionTwo, _ => { effectTarget = _ }),
                ]
                , store = createStore(effects)

            store.dispatch(actionOne('modified'))

            expect(effectTarget).toBe('initial')
        })
    })
})

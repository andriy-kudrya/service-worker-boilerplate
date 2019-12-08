import * as redux from 'redux'
import AppState from '#/model/app-state'
import { creatorFactory } from '#/utils/redux/action'
import { noop } from '#/utils/function'
import effectsMiddlewareFactory, { EffectsFactory, handler } from '#/utils/redux/effect'
import { delay } from '#/utils/timeout'

import errorMw from './middleware'
import errors from './reducer'
import { removeError } from './actions'

describe('error', function () {
    function createStore(...effects: EffectsFactory<AppState>[]) {
        const mw = effectsMiddlewareFactory(...effects)
        return redux.createStore(
            redux.combineReducers({ errors }),
            redux.applyMiddleware(errorMw, mw)
        )
    }

    const creator = creatorFactory('test')
        , effect = creator<void>('EFFECT')
        , effectTwo = creator<void>('EFFECT_TWO')
        , effectAsync = creator<void, Promise<void>>('EFFECT_ASYNC')
        , effectAsyncTwo = creator<void, Promise<void>>('EFFECT_ASYNC_TWO')

    it('should catch synchronous error', function () {
        const effects: EffectsFactory<AppState> = () => [
                handler(effect, _ => { throw new Error('foo') }),
            ]
            , store = createStore(effects)

        expect(() => store.dispatch(effect())).not.toThrow()
    })

    it('should register synchronous error', function () {
        const effects: EffectsFactory<AppState> = () => [
                handler(effect, _ => { throw new Error('foo') }),
                handler(effectTwo, _ => { throw new Error('bar') }),
            ]
            , store = createStore(effects)

        // exercise
        store.dispatch(effect())
        store.dispatch(effectTwo())

        expect(store.getState().errors).toEqual(
            [
                { message: 'foo' },
                { message: 'bar' },
            ]
        )
    })

    it('should register asynchronous error', function () {
        const effects: EffectsFactory<AppState> = () => [
                handler(effectAsync, _ => Promise.reject('foo')),
                handler(effectAsyncTwo, _ => Promise.reject('bar')),
            ]
            , store = createStore(effects)

        // exercise
        const ready = Promise.all([
                store.dispatch(effectAsync()),
                store.dispatch(effectAsyncTwo()),
            ])
            .catch(noop)

        return ready.then(
            _ =>
                expect(store.getState().errors).toEqual(
                    [
                        { message: 'foo' },
                        { message: 'bar' },
                    ]
                )
        )
    })

    it('should register unhandled error', function () {
        const store = createStore(() => [])

        jest.spyOn(console, 'error').mockImplementationOnce(noop)

        setTimeout(() => {
            throw new Error('unhandled')
        }, 0)

        const result = delay(1).then(
            _ =>
                expect(store.getState().errors).toEqual(
                    [
                        { message: 'unhandled' },
                    ]
                )
        )

        return result
    })

    it('should remove error by reference', function () {
        const effects: EffectsFactory<AppState> = () => [
                handler(effect, _ => { throw new Error('foo') }),
                handler(effectTwo, _ => { throw new Error('bar') }),
            ]
            , store = createStore(effects)

        store.dispatch(effect())
        store.dispatch(effectTwo())
        const error = store.getState().errors[0]

        // exercise
        store.dispatch(removeError(error))

        expect(store.getState().errors).toEqual(
            [
                { message: 'bar' },
            ]
        )
    })
})

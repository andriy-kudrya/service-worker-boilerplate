import { createStore, applyMiddleware, combineReducers } from 'redux'

import AppState from '#/model/app-state'

import logMiddleware from '#/utils/middleware/log'

import errorMiddleware from '#/features/error/middleware'
import errors from '#/features/error/reducer'

import pwaMiddlewareFactory from '#/features/pwa/middleware'
import pwaFactory from '#/infrastructure/pwa/pwa'

const swMiddleware = pwaMiddlewareFactory(pwaFactory())

const reducer = combineReducers<AppState>({
        errors,
    })

const store = createStore(
        reducer,
        applyMiddleware(logMiddleware, errorMiddleware, swMiddleware)
    )

export default store

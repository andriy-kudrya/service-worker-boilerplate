import { createStore, applyMiddleware, combineReducers, ReducersMapObject } from 'redux'

import AppState from '#/model/app-state'

import logMiddleware from '#/utils/middleware/log'
import errorMiddleware from '#/features/error/middleware'

import { reducer } from '#/utils/redux/reducer'
import errorsState from '#/features/error/default-state'

const defaultReducerMap: ReducersMapObject<AppState> = {
        errors: reducer(errorsState),
    }

const store = createStore(
        combineReducers(defaultReducerMap),
        applyMiddleware(logMiddleware, errorMiddleware)
    )

export default store

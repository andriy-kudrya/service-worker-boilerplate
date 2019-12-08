import { Middleware } from '#/utils/redux'
import AppState from '#/model/app-state'
import AppError from '#/model/app-error'

import { addError } from './actions'

const middleware: Middleware<AppState> = _api => next => {
    window.addEventListener('error', (event: ErrorEvent) => {
        next(addError(getAppError(event.error)))
    })

    return action => {
        try {
            const result: any = next(action)

            if (result && result.catch)
                return result.catch((reason: any) => next(addError(getAppError(reason))))

            return result
        }
        catch (error) {
            const appError = getAppError(error)
            next(addError(appError))
        }

    }

    function getAppError(error: any): AppError {
        if (error instanceof Error)
            return { message: error.message }

        if (typeof error === 'string')
            return { message: error }

        return { message: 'Unknown error occurred' }
    }
}
export default middleware

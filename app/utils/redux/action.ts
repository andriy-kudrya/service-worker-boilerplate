import { ActionType, Action, HasActionType } from './types'
/**
 * By default return type of dispatch function should be action itself but I see no way to declare such recursive type:
 * Action<P,
 *    Action<P, ...>
 * >
 * Default dispatch result doesn't seem to be useful anyway so 'AnyAction' terminator is used
 */
interface AnyAction {
    type: string
    payload?: any
}

function creatorFactory(typePrefix: string) {
    function getCreator<P extends void, R = AnyAction>(suffix: ActionType<void, R>): (() => Action<void, R>) & HasActionType<P, R>
    function getCreator<P, R = AnyAction>(suffix: ActionType<P, R>): ((payload: P) => Action<P, R>) & HasActionType<P, R>
    function getCreator<P, R>(suffix: ActionType<P, R>) {
        const type = `${typePrefix}.${suffix}`

        function actionCreator(payload: P) {
            return arguments.length ? { type, payload } : { type }
        }

        actionCreator.type = type

        return actionCreator
    }

    return getCreator
}


function isPayloadAction(action: Action<any, any>): action is { type: ActionType<any, any>, payload: any } {
    return 'payload' in action
}

function actionHasType<P, R>(action: any, creator: HasActionType<P, R>): action is Action<P, R> {
    return action.type === creator.type
}

export { creatorFactory, isPayloadAction, actionHasType }

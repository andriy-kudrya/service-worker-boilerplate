import { reducer, handler } from '#/utils/redux/reducer'
import * as actions from './actions'
import defaultState from './default-state'

export default reducer(
    defaultState,
    handler(actions.addError, (state, error) => state.concat(error)),
    handler(actions.removeError, (state, error) => state.filter(_ => _ !== error)),
)

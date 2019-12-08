import '#/styles/main.sass'

import * as React from 'react'
import { render } from 'react-dom'

import ReduxContext from '#/utils/redux/context'

import Shell from '#/features/shell/shell'

import store from './store'

render(
    <React.StrictMode>
        <ReduxContext.Provider value={store}>
            <Shell />
        </ReduxContext.Provider>
    </React.StrictMode>,
    document.getElementById('app')
)

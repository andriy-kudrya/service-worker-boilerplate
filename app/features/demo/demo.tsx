import { React } from '#/facade/react'
import { useEffect } from '#/facade/hooks'
import config from '#/constants/config'

function Demo() {
    const DEMO_PAGE = 'Demo page'

    useEffect(
        () => {
            navigator.serviceWorker.register(`${config.serviceWorkerName}.js`)
        },
        []
    )

    return (
        <div className='container'>
            {DEMO_PAGE}
        </div>
    )
}

export default Demo

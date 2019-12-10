import Pwa from '#/model/pwa/pwa'
import config from '#/constants/config'

function factory(): Pwa {
    let registration: ServiceWorkerRegistration

    refreshOnControllerChange()

    return {
        register,
        checkForUpdate,
    }

    function register(): Promise<void> {
        return navigator.serviceWorker
                .register(`${config.serviceWorkerName}.js`)
                .then(reg => {
                    registration = reg
                })
                .then(listenForUpdates)
    }

    function checkForUpdate(): Promise<void> {
        if (!registration)
            return Promise.resolve()

        return registration.update()
    }

    function listenForUpdates(): void {
        // registration.installing
        // registration.waiting
        // registration.active

        registration!.addEventListener('updatefound', () => {
            // A wild service worker has appeared in reg.installing!
            const newWorker = registration.installing!

            newWorker.state
            // "installing" - the install event has fired, but not yet complete
            // "installed"  - install complete
            // "activating" - the activate event has fired, but not yet complete
            // "activated"  - fully active
            // "redundant"  - discarded. Either failed install, or it's been
            //                replaced by a newer version

            newWorker.addEventListener('statechange', () => {
                // newWorker.state
            })
        })
    }

    function refreshOnControllerChange() {
        navigator.serviceWorker.addEventListener('controllerchange', () => location.reload())
    }
}

export default factory

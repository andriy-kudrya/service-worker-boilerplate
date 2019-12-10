import config from '#/constants/config'

const CACHE_PREFIX = 'pwa-demo-'
    , CACHE_NAME = CACHE_PREFIX + config.swId

function discoverAssets(): Promise<string[]> {
    return fetch(`/${config.assetManifestFileName}`)
        .then(
            res =>
                res.status >= 200 && res.status < 300
                    ? res.json()
                    : Promise.reject(res.status)
        )
        .then(Object.values)
}

self.addEventListener('install', event => {
    self.skipWaiting()

    event.waitUntil(
        Promise.all([caches.open(CACHE_NAME), discoverAssets()])
            .then(([cache, assets]) => cache.addAll(assets))
    )
})

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                const keysToDelete = keys.filter(_ => _.startsWith(CACHE_PREFIX) && _ !== CACHE_NAME)

                return Promise.all([keysToDelete.map(_ => caches.delete(_))])
            })
            .then(() => self.clients.claim())
    )
})

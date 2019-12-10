declare const ASSET_MANIFEST_FILE_NAME: string
declare const SW_ID: string

function discoverAssets(): Promise<string[]> {
    return fetch(`./${ASSET_MANIFEST_FILE_NAME}`)
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
        Promise.all([caches.open(SW_ID), discoverAssets()])
            .then(([cache, assets]) => cache.addAll(assets))
    )
})

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                const keysToDelete = keys.filter(_ => _ !== SW_ID)

                return Promise.all([keysToDelete.map(_ => caches.delete(_))])
            })
            .then(() => self.clients.claim())
    )
})

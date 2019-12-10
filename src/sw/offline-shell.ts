self.addEventListener('fetch', event => {
    const url = new URL(event.request.url)
        , isShell = url.origin === location.origin && event.request.method === 'GET'

    if (!isShell) {
        event.respondWith(fetch(event.request))
        return
    }

    event.respondWith(
        caches
            .match(event.request)
            .then(response => response || caches.match('/index.html'))
            .then(response => response || Promise.reject())
    )
})

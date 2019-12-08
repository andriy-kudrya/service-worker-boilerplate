const params = {
    serviceWorkerName: 'sw',
    assetManifestFileName: 'manifest.json',
}

export function initParams(env = {}) {
    Object.assign(params, {
        debug: !!env.debug,
        analyze: !!env.analyze,
        api: env.api || 'http://localhost:8080',
    })
}

export default params

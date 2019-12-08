declare interface WorkerGlobalScope {
    addEventListener(type: 'install', listener: (event: ExtendableEvent) => void, options?: boolean | AddEventListenerOptions): void
    addEventListener(type: 'activate', listener: (event: ExtendableEvent) => void, options?: boolean | AddEventListenerOptions): void
    addEventListener(type: 'fetch', listener: (event: FetchEvent) => void, options?: boolean | AddEventListenerOptions): void
}

declare const clients: Clients

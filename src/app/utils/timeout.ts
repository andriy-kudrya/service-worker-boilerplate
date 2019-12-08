function delay(): Promise<void>
function delay(ms: number): Promise<void>
function delay(ms = 100): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export { delay }

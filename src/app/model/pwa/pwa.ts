interface Pwa {
    register(): Promise<void>
    checkForUpdate(): Promise<void>
}

export default Pwa

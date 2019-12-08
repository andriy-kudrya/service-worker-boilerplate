import { useReducer } from 'react'

const inc = (x: number) => x + 1
    , useForceUpdate = () => useReducer<React.Reducer<number, void>>(inc, 0)[1] as () => void

export default useForceUpdate

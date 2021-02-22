export type SetStateValue<S> = (value: S | ((prevState: S) => S)) => void

export type UseStateReturns<S> = [S | undefined, SetStateValue<S | undefined>]

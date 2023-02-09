export type Input<T> = T | (() => T)

export function read<T>(input: Input<T>): T {
    if (typeof input == "function") {
        return input.call(null)
    } else {
        return input
    }
}
export const boundary = (...fns) => obj => fns.reduce((acc, fn) => fn(acc), obj))

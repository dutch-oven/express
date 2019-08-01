export default (...fns) => obj => fns.reduce((acc, fn) => fn(acc), obj);

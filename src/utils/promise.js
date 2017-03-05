function promise (fn, thisArg) {
    return (...args) => {
        let res, rej, prom = new Promise((s, f) => { res = s; rej = f; });

        fn.apply(thisArg || fn, [...args, (err, ...data) => err ? rej(err) : res(data.length > 1 ? data : data[0])]);

        return prom;
    };
}

module.exports = { promise };
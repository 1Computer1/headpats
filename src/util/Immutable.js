class Immutable {
    static set(object, key, value) {
        return Immutable.assign(object, { [key]: value });
    }

    static delete(object, ...keys) {
        const o = Immutable.assign(object);
        for (const key of keys) {
            delete o[key];
        }

        return o;
    }

    static assign(...objects) {
        const result = {};
        for (const object of objects) {
            Object.assign(result, object);
        }

        return result;
    }
}

module.exports = Immutable;

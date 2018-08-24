class Immutable {
    static set(object, key, value) {
        return Immutable.assign(object, { [key]: value });
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

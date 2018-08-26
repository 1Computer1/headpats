class ImmutableMap {
    static set(map, key, value) {
        return ImmutableMap.merge(map, new Map().set(key, value));
    }

    static delete(map, ...keys) {
        const m = ImmutableMap.merge(map);
        for (const key of keys) {
            m.delete(key);
        }

        return m;
    }

    static merge(...maps) {
        const entries = maps.reduce((acc, map) => acc.concat([...map.entries()]), []);
        return new Map(entries);
    }
}

module.exports = ImmutableMap;

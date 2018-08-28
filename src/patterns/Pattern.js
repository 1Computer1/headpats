const { extractor, rest } = require('../util/symbols');
const isPrimitive = require('../util/isPrimitive');
const Immutable = require('../util/Immutable');
const ImmutableArray = require('../util/ImmutableArray');
const ImmutableMap = require('../util/ImmutableMap');

class Pattern {
    [extractor]() {
        throw new TypeError('Extractor function not implemented');
    }

    test(value) {
        return this[extractor](value, {}).matched;
    }

    match(value) {
        const { matched, extracted } = this[extractor](value, {});
        return matched ? extracted : null;
    }

    static patternOf(value) {
        if (value == null || value[extractor] == null) {
            if (isPrimitive(value)) {
                return Pattern.patternOfPrimitive(value);
            }

            if (Array.isArray(value)) {
                return Pattern.patternOfArray(value);
            }

            if (value instanceof Map) {
                return Pattern.patternOfMap(value);
            }

            return Pattern.patternOfObject(value);
        }

        return value;
    }

    static patternOfPrimitive(value) {
        const EqualPattern = require('./EqualPattern');
        return new EqualPattern(value);
    }

    static patternOfArray(array) {
        const ArrayPattern = require('./ArrayPattern');
        const hasRest = Array.isArray(array[array.length - 1])
            && array[array.length - 1].length === 2
            && array[array.length - 1][0] === rest;

        if (hasRest) {
            return new ArrayPattern(ImmutableArray.remove(array, -1), array[array.length - 1][1]);
        }

        return new ArrayPattern(array);
    }

    static patternOfMap(map) {
        const MapPattern = require('./MapPattern');
        if (map.has(rest)) {
            return new MapPattern(ImmutableMap.delete(map, rest), map.get(rest));
        }

        return new MapPattern(map);
    }

    static patternOfObject(object) {
        const ObjectPattern = require('./ObjectPattern');
        if (rest in object) {
            return new ObjectPattern(Immutable.delete(object, rest), object[rest]);
        }

        return new ObjectPattern(object);
    }
}

module.exports = Pattern;

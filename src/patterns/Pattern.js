const extractor = require('../util/extractor');
const isPrimitive = require('../util/isPrimitive');
const Immutable = require('../util/Immutable');
const ImmutableArray = require('../util/ImmutableArray');
const ImmutableMap = require('../util/ImmutableMap');
const rest = require('../util/rest');

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

    static patternOf(pattern) {
        const ArrayPattern = require('./ArrayPattern');
        const EqualPattern = require('./EqualPattern');
        const MapPattern = require('./MapPattern');
        const ObjectPattern = require('./ObjectPattern');

        if (pattern == null || pattern[extractor] == null) {
            if (isPrimitive(pattern)) {
                return new EqualPattern(pattern);
            }

            if (Array.isArray(pattern)) {
                const hasRest = Array.isArray(pattern[pattern.length - 1])
                    && pattern[pattern.length - 1].length === 2
                    && pattern[pattern.length - 1][0] === rest;
                if (hasRest) {
                    return new ArrayPattern(ImmutableArray.remove(pattern, -1), pattern[pattern.length - 1][1]);
                }

                return new ArrayPattern(pattern);
            }

            if (pattern instanceof Map) {
                if (pattern.has(rest)) {
                    return new MapPattern(ImmutableMap.delete(pattern, rest), pattern.get(rest));
                }

                return new MapPattern(pattern);
            }

            if (rest in pattern) {
                return new ObjectPattern(Immutable.delete(pattern, rest), pattern[rest]);
            }

            return new ObjectPattern(pattern);
        }

        return pattern;
    }
}

module.exports = Pattern;

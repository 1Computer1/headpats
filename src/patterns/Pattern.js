const extractor = require('../util/extractor');
const isPrimitive = require('../util/isPrimitive');

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
                return new ArrayPattern(pattern);
            }

            if (pattern instanceof Map) {
                return new MapPattern(pattern);
            }

            return new ObjectPattern(pattern);
        }

        return pattern;
    }
}

module.exports = Pattern;

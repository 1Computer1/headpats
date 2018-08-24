const extractor = require('../util/extractor');
const ignored = require('../util/ignored');
const Immutable = require('../util/Immutable');
const Pattern = require('./Pattern');

class ArrayPattern extends Pattern {
    constructor(patterns, restPattern) {
        super();

        if (!Array.isArray(patterns)) {
            throw new TypeError('Given patterns must be in an array');
        }

        this.patterns = patterns;
        this.restPattern = restPattern;
        this.rest = arguments.length >= 2;
    }

    [extractor](value, previousExtracted) {
        if (!Array.isArray(value)) {
            return { matched: false };
        }

        if (this.rest ? value.length < this.patterns.length : value.length !== this.patterns.length) {
            return { matched: false };
        }

        let innerExtracted = {};
        for (let i = 0; i < this.patterns.length; i++) {
            const pattern = Pattern.patternOf(this.patterns[i]);
            if (pattern[ignored]) {
                continue;
            }

            const { matched, extracted } = pattern[extractor](value[i], Immutable.assign(previousExtracted, innerExtracted));
            if (!matched) {
                return { matched: false };
            }

            innerExtracted = Immutable.assign(innerExtracted, extracted);
        }

        const restPattern = Pattern.patternOf(this.restPattern);
        if (this.rest && !restPattern[ignored]) {
            const restValues = value.slice(this.patterns.length);
            const { matched, extracted } = restPattern[extractor](restValues, Immutable.assign(previousExtracted, innerExtracted));
            if (!matched) {
                return { matched: false };
            }

            return { matched: true, extracted: Immutable.assign(innerExtracted, extracted) };
        }

        return { matched: true, extracted: innerExtracted };
    }
}

module.exports = ArrayPattern;

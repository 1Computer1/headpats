const { extractor, ignored } = require('../util/symbols');
const Immutable = require('../util/Immutable');
const Pattern = require('./Pattern');

class ArrayPattern extends Pattern {
    constructor(patterns, restPattern) {
        super();

        if (!Array.isArray(patterns)) {
            throw new TypeError('Given patterns must be in an array');
        }

        this.patterns = patterns.map(Pattern.patternOf);
        this.rest = arguments.length >= 2;
        this.restPattern = this.rest ? Pattern.patternOf(restPattern) : null;
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
            if (this.patterns[i][ignored]) {
                continue;
            }

            const { matched, extracted } = this.patterns[i][extractor](value[i], Immutable.assign(previousExtracted, innerExtracted));
            if (!matched) {
                return { matched: false };
            }

            innerExtracted = Immutable.assign(innerExtracted, extracted);
        }

        if (this.rest && !this.restPattern[ignored]) {
            const restValues = value.slice(this.patterns.length);
            const { matched, extracted } = this.restPattern[extractor](restValues, Immutable.assign(previousExtracted, innerExtracted));
            if (!matched) {
                return { matched: false };
            }

            return { matched: true, extracted: Immutable.assign(innerExtracted, extracted) };
        }

        return { matched: true, extracted: innerExtracted };
    }
}

module.exports = ArrayPattern;

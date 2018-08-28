const { extractor, ignored } = require('../util/symbols');
const Immutable = require('../util/Immutable');
const Pattern = require('./Pattern');

class MapPattern extends Pattern {
    constructor(patterns, restPattern) {
        super();

        if (!(patterns instanceof Map)) {
            throw new TypeError('Given patterns must be in a Map');
        }

        this.patterns = new Map([...patterns.entries()].map(([k, v]) => [k, Pattern.patternOf(v)]));
        this.rest = arguments.length >= 2;
        this.restPattern = this.rest ? Pattern.patternOf(restPattern) : null;
    }

    [extractor](value, previousExtracted) {
        if (!(value instanceof Map)) {
            return { matched: false };
        }

        let innerExtracted = {};
        for (const [key, pattern] of this.patterns) {
            if (!value.has(key)) {
                return { matched: false };
            }

            if (pattern[ignored]) {
                continue;
            }

            const { matched, extracted } = pattern[extractor](value.get(key), Immutable.assign(previousExtracted, innerExtracted));
            if (!matched) {
                return { matched: false };
            }

            innerExtracted = Immutable.assign(innerExtracted, extracted);
        }

        if (this.rest && !this.restPattern[ignored]) {
            const restMap = new Map();
            for (const [key, mapValue] of value) {
                if (!this.patterns.has(key)) {
                    restMap.set(key, mapValue);
                }
            }

            const { matched, extracted } = this.restPattern[extractor](restMap, Immutable.assign(previousExtracted, innerExtracted));
            if (!matched) {
                return { matched: false };
            }

            return { matched: true, extracted: Immutable.assign(innerExtracted, extracted) };
        }

        return { matched: true, extracted: innerExtracted };
    }
}

module.exports = MapPattern;

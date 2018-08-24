const extractor = require('../util/extractor');
const ignored = require('../util/ignored');
const Immutable = require('../util/Immutable');
const Pattern = require('./Pattern');

class MapPattern extends Pattern {
    constructor(patterns, restPattern) {
        super();

        if (!(patterns instanceof Map)) {
            throw new TypeError('Given patterns must be in a Map');
        }

        this.patterns = patterns;
        this.restPattern = restPattern;
        this.rest = arguments.length >= 2;
    }

    [extractor](value, previousExtracted) {
        if (!(value instanceof Map)) {
            return { matched: false };
        }

        let innerExtracted = {};
        for (const [key, patternValue] of this.patterns) {
            if (!value.has(key)) {
                return { matched: false };
            }

            const pattern = Pattern.patternOf(patternValue);
            if (pattern[ignored]) {
                continue;
            }

            const { matched, extracted } = pattern[extractor](value.get(key), Immutable.assign(previousExtracted, innerExtracted));
            if (!matched) {
                return { matched: false };
            }

            innerExtracted = Immutable.assign(innerExtracted, extracted);
        }

        const restPattern = Pattern.patternOf(this.restPattern);
        if (this.rest && !restPattern[ignored]) {
            const restMap = new Map();
            for (const [key, mapValue] of value) {
                if (!this.patterns.has(key)) {
                    restMap.set(key, mapValue);
                }
            }

            const { matched, extracted } = restPattern[extractor](restMap, Immutable.assign(previousExtracted, innerExtracted));
            if (!matched) {
                return { matched: false };
            }

            return { matched: true, extracted: Immutable.assign(innerExtracted, extracted) };
        }

        return { matched: true, extracted: innerExtracted };
    }
}

module.exports = MapPattern;

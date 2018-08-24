const extractor = require('../util/extractor');
const ignored = require('../util/ignored');
const Immutable = require('../util/Immutable');
const Pattern = require('./Pattern');

class ObjectPattern extends Pattern {
    constructor(patterns, restPattern) {
        super();

        this.patterns = patterns;
        this.restPattern = restPattern;
        this.rest = arguments.length >= 2;
    }

    [extractor](value, previousExtracted) {
        if (value == null || typeof value !== 'object') {
            return { matched: false };
        }

        const patternKeys = ObjectPattern.getOwnPropertyKeys(this.patterns);
        let innerExtracted = {};
        for (const key of patternKeys) {
            if (!(key in value)) {
                return { matched: false };
            }

            const pattern = Pattern.patternOf(this.patterns[key]);
            if (pattern[ignored]) {
                continue;
            }

            const { matched, extracted } = pattern[extractor](value[key], Immutable.assign(previousExtracted, innerExtracted));
            if (!matched) {
                return { matched: false };
            }

            innerExtracted = Immutable.assign(innerExtracted, extracted);
        }

        const restPattern = Pattern.patternOf(this.restPattern);
        if (this.rest && !restPattern[ignored]) {
            const restObject = ObjectPattern.getOwnPropertyKeys(value)
                .filter(k => !patternKeys.includes(k))
                .reduce((acc, k) => {
                    acc[k] = value[k];
                    return acc;
                }, {});

            const { matched, extracted } = restPattern[extractor](restObject, Immutable.assign(previousExtracted, innerExtracted));
            if (!matched) {
                return { matched: false };
            }

            return { matched: true, extracted: Immutable.assign(innerExtracted, extracted) };
        }

        return { matched: true, extracted: innerExtracted };
    }

    static getOwnPropertyKeys(value) {
        return Object.getOwnPropertyNames(value).concat(Object.getOwnPropertySymbols(value));
    }
}

module.exports = ObjectPattern;

const { extractor, ignored } = require('../util/symbols');
const isPrimitive = require('../util/isPrimitive');
const Immutable = require('../util/Immutable');
const Pattern = require('./Pattern');

class ObjectPattern extends Pattern {
    constructor(patterns, restPattern) {
        super();

        if (patterns == null || typeof patterns !== 'object') {
            throw new TypeError('Given patterns must be in an object');
        }

        this.patterns = ObjectPattern.getOwnPropertyKeys(patterns).reduce((acc, k) => {
            acc[k] = Pattern.patternOf(patterns[k]);
            return acc;
        }, {});

        this.rest = arguments.length >= 2;
        this.restPattern = this.rest ? Pattern.patternOf(restPattern) : null;
    }

    [extractor](value, previousExtracted) {
        if (isPrimitive(value)) {
            return { matched: false };
        }

        const patternKeys = ObjectPattern.getOwnPropertyKeys(this.patterns);
        let innerExtracted = {};
        for (const key of patternKeys) {
            if (!(key in value)) {
                return { matched: false };
            }

            if (this.patterns[key][ignored]) {
                continue;
            }

            const { matched, extracted } = this.patterns[key][extractor](value[key], Immutable.assign(previousExtracted, innerExtracted));
            if (!matched) {
                return { matched: false };
            }

            innerExtracted = Immutable.assign(innerExtracted, extracted);
        }

        if (this.rest && !this.restPattern[ignored]) {
            const restObject = ObjectPattern.getOwnPropertyKeys(value)
                .filter(k => !patternKeys.includes(k))
                .reduce((acc, k) => {
                    acc[k] = value[k];
                    return acc;
                }, {});

            const { matched, extracted } = this.restPattern[extractor](restObject, Immutable.assign(previousExtracted, innerExtracted));
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

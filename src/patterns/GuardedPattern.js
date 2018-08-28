const { extractor } = require('../util/symbols');
const Pattern = require('./Pattern');

class GuardedPattern extends Pattern {
    constructor(pattern, predicate) {
        super();

        this.pattern = Pattern.patternOf(pattern);
        this.predicate = predicate;
    }

    [extractor](value, previousExtracted) {
        const result = this.pattern[extractor](value, previousExtracted);
        if (!result.matched) {
            return { matched: false };
        }

        if (!this.predicate(result.extracted)) {
            return { matched: false };
        }

        return result;
    }
}

module.exports = GuardedPattern;

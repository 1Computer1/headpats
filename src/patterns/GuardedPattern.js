const extractor = require('../util/extractor');
const Pattern = require('./Pattern');

class GuardedPattern extends Pattern {
    constructor(pattern, predicate) {
        super();

        this.pattern = pattern;
        this.predicate = predicate;
    }

    [extractor](value, previousExtracted) {
        const result = Pattern.patternOf(this.pattern)[extractor](value, previousExtracted);
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

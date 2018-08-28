const { extractor } = require('../util/symbols');
const Pattern = require('./Pattern');

class PreguardedPattern extends Pattern {
    constructor(predicate, pattern) {
        super();

        this.predicate = predicate;
        this.pattern = Pattern.patternOf(pattern);
    }

    [extractor](value, previousExtracted) {
        if (this.predicate(value)) {
            return this.pattern[extractor](value, previousExtracted);
        }

        return { matched: false };
    }
}

module.exports = PreguardedPattern;

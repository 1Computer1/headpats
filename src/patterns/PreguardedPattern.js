const extractor = require('../util/extractor');
const Pattern = require('./Pattern');

class PreguardedPattern extends Pattern {
    constructor(predicate, pattern) {
        super();

        this.predicate = predicate;
        this.pattern = pattern;
    }

    [extractor](value, previousExtracted) {
        if (this.predicate(value)) {
            return Pattern.patternOf(this.pattern)[extractor](value, previousExtracted);
        }

        return { matched: false };
    }
}

module.exports = PreguardedPattern;

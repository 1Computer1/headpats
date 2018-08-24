const extractor = require('../util/extractor');
const Pattern = require('./Pattern');

class TypePattern extends Pattern {
    constructor(type, pattern) {
        super();

        this.type = type;
        this.pattern = pattern;
    }

    [extractor](value, previousExtracted) {
        if (typeof value === this.type) {
            return Pattern.patternOf(this.pattern)[extractor](value, previousExtracted);
        }

        return { matched: false };
    }
}

module.exports = TypePattern;

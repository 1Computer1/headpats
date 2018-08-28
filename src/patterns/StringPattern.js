const { extractor } = require('../util/symbols');
const Pattern = require('./Pattern');

class StringPattern extends Pattern {
    constructor(string, restPattern) {
        super();

        this.string = string;
        this.restPattern = Pattern.patternOf(restPattern);
    }

    [extractor](value, previousExtracted) {
        if (typeof value !== 'string') {
            return { matched: false };
        }

        if (!value.startsWith(this.string)) {
            return { matched: false };
        }

        return this.restPattern[extractor](value.slice(this.string.length), previousExtracted);
    }
}

module.exports = StringPattern;

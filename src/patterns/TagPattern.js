const { extractor } = require('../util/symbols');
const Pattern = require('./Pattern');

class TagPattern extends Pattern {
    constructor(Class, pattern) {
        super();

        this.Class = Class;
        this.pattern = Pattern.patternOf(pattern);
    }

    [extractor](value, previousExtracted) {
        if (value instanceof this.Class) {
            return this.pattern[extractor](value.value, previousExtracted);
        }

        return { matched: false };
    }
}

module.exports = TagPattern;

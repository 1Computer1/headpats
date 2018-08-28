const { extractor } = require('../util/symbols');
const Pattern = require('./Pattern');

class InstancePattern extends Pattern {
    constructor(Class, pattern) {
        super();

        this.Class = Class;
        this.pattern = Pattern.patternOf(pattern);
    }

    [extractor](value, previousExtracted) {
        if (value instanceof this.Class) {
            return this.pattern[extractor](value, previousExtracted);
        }

        return { matched: false };
    }
}

module.exports = InstancePattern;

const extractor = require('../util/extractor');
const Pattern = require('./Pattern');

class InstancePattern extends Pattern {
    constructor(Class, pattern) {
        super();

        this.Class = Class;
        this.pattern = pattern;
    }

    [extractor](value, previousExtracted) {
        if (value instanceof this.Class) {
            return Pattern.patternOf(this.pattern)[extractor](value, previousExtracted);
        }

        return { matched: false };
    }
}

module.exports = InstancePattern;

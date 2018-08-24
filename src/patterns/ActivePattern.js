const extractor = require('../util/extractor');
const Pattern = require('./Pattern');

class ActivePattern extends Pattern {
    constructor(fn, pattern) {
        super();

        this.fn = fn;
        this.pattern = pattern;
    }

    [extractor](value, previousExtracted) {
        return Pattern.patternOf(this.pattern)[extractor](this.fn(value), previousExtracted);
    }
}

module.exports = ActivePattern;

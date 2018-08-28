const { extractor } = require('../util/symbols');
const Pattern = require('./Pattern');

class ViewPattern extends Pattern {
    constructor(fn, pattern) {
        super();

        this.fn = fn;
        this.pattern = Pattern.patternOf(pattern);
    }

    [extractor](value, previousExtracted) {
        return this.pattern[extractor](this.fn(value), previousExtracted);
    }
}

module.exports = ViewPattern;

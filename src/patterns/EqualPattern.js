const { extractor } = require('../util/symbols');
const Pattern = require('./Pattern');

class EqualPattern extends Pattern {
    constructor(value) {
        super();

        this.value = value;
    }

    [extractor](value) {
        return Object.is(value, this.value)
            ? { matched: true, extracted: {} }
            : { matched: false };
    }
}

module.exports = EqualPattern;

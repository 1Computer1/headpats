const extractor = require('../util/extractor');
const Pattern = require('./Pattern');

class EqualPattern extends Pattern {
    constructor(value) {
        super();
        this.value = value;
    }

    [extractor](value) {
        return value === this.value
            ? { matched: true, extracted: {} }
            : { matched: false };
    }
}

module.exports = EqualPattern;

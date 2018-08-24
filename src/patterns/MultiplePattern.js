const extractor = require('../util/extractor');
const Pattern = require('./Pattern');

class MultiplePattern extends Pattern {
    constructor(...values) {
        super();
        this.values = values;
    }

    [extractor](value) {
        if (this.values.some(x => x === value)) {
            return { matched: true, extracted: {} };
        }

        return { matched: false };
    }
}

module.exports = MultiplePattern;

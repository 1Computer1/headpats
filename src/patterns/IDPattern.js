const extractor = require('../util/extractor');
const Pattern = require('./Pattern');

class IDPattern extends Pattern {
    constructor(id) {
        super();

        this.id = id;
    }

    [extractor](value, previousExtracted) {
        if (this.id in previousExtracted && value !== previousExtracted[this.id]) {
            return { matched: false };
        }

        return { matched: true, extracted: { [this.id]: value } };
    }
}

module.exports = IDPattern;

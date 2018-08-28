const { extractor } = require('../util/symbols');
const Immutable = require('../util/Immutable');
const Pattern = require('./Pattern');

class BindPattern extends Pattern {
    constructor(pattern, id) {
        super();

        this.pattern = Pattern.patternOf(pattern);
        this.id = id;
    }

    [extractor](value, previousExtracted) {
        if (this.id in previousExtracted && !Object.is(value, previousExtracted[this.id])) {
            return { matched: false };
        }

        const { matched, extracted } = this.pattern[extractor](value, previousExtracted);
        if (!matched) {
            return { matched: false };
        }

        if (this.id in extracted) {
            throw new TypeError('Cannot create binding of the same name as one of the bindings in contained pattern');
        }

        return { matched: true, extracted: Immutable.set(extracted, this.id, value) };
    }
}

module.exports = BindPattern;

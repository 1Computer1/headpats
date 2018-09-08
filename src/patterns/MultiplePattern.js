const { extractor } = require('../util/symbols');
const Pattern = require('./Pattern');

class MultiplePattern extends Pattern {
    constructor(...patterns) {
        super();

        this.patterns = patterns.map(Pattern.patternOf);
    }

    [extractor](value, previousExtracted) {
        for (const pattern of this.patterns) {
            const { matched, extracted } = pattern[extractor](value, previousExtracted);
            if (matched) {
                return { matched: true, extracted };
            }
        }

        return { matched: false };
    }
}

module.exports = MultiplePattern;

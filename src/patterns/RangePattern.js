const { extractor } = require('../util/symbols');
const Pattern = require('./Pattern');

class RangePattern extends Pattern {
    constructor(lowerBound, upperBound, exclusive = true) {
        super();

        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.exclusive = exclusive;
    }

    [extractor](value) {
        if (value >= this.lowerBound && (this.exclusive ? value < this.upperBound : value <= this.upperBound)) {
            return { matched: true, extracted: {} };
        }

        return { matched: false };
    }
}

module.exports = RangePattern;

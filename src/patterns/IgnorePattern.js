const { extractor, ignored } = require('../util/symbols');
const Pattern = require('./Pattern');

class IgnorePattern extends Pattern {
    get [ignored]() {
        return true;
    }

    [extractor]() {
        return { matched: true, extracted: {} };
    }
}

module.exports = IgnorePattern;

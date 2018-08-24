const extractor = require('../util/extractor');
const ignored = require('../util/ignored');
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

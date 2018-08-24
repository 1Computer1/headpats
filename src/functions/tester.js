const extractor = require('../util/extractor');
const Pattern = require('../patterns/Pattern');

const testConstruct = pattern => {
    return value => {
        const { matched } = Pattern.patternOf(pattern)[extractor](value, {});
        return matched;
    };
};

module.exports = testConstruct;

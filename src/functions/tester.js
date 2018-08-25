const extractor = require('../util/extractor');
const Pattern = require('../patterns/Pattern');

const tester = pattern => {
    return value => {
        const { matched } = Pattern.patternOf(pattern)[extractor](value, {});
        return matched;
    };
};

module.exports = tester;

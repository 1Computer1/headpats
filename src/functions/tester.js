const extractor = require('../util/extractor');
const Pattern = require('../patterns/Pattern');

const tester = pattern => {
    pattern = Pattern.patternOf(pattern);
    return value => pattern[extractor](value, {}).matched;
};
module.exports = tester;

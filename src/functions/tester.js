const extractor = require('../util/extractor');
const Pattern = require('../patterns/Pattern');

const tester = pattern => value => Pattern.patternOf(pattern)[extractor](value, {}).matched;
module.exports = tester;

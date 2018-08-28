const { extractor } = require('../util/symbols');
const Pattern = require('../patterns/Pattern');

const matcher = pattern => {
    pattern = Pattern.patternOf(pattern);
    return value => {
        const { matched, extracted } = pattern[extractor](value, {});
        return matched ? extracted : null;
    };
};

module.exports = matcher;

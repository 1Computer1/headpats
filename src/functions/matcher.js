const extractor = require('../util/extractor');
const Pattern = require('../patterns/Pattern');

const matcher = pattern => {
    return value => {
        const { matched, extracted } = Pattern.patternOf(pattern)[extractor](value, {});
        return matched ? extracted : null;
    };
};

module.exports = matcher;

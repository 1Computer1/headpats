const extractor = require('../util/extractor');
const Pattern = require('../patterns/Pattern');

const matchConstruct = pattern => {
    return value => {
        const { matched, extracted } = Pattern.patternOf(pattern)[extractor](value, {});
        return matched ? extracted : null;
    };
};

module.exports = matchConstruct;

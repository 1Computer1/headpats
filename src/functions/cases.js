const extractor = require('../util/extractor');
const GuardedPattern = require('../patterns/GuardedPattern');
const Pattern = require('../patterns/Pattern');

const casesConstruct = () => {
    const context = {
        cases: [],
        case(pattern, cb) {
            this.cases.push([pattern, cb]);
            return this;
        },
        caseGuarded(pattern, predicate, cb) {
            this.cases.push([new GuardedPattern(pattern, predicate), cb]);
            return this;
        }
    };

    return Object.assign(value => {
        for (const [pattern, cb] of context.cases) {
            const { matched, extracted } = Pattern.patternOf(pattern)[extractor](value, {});
            if (matched) {
                return cb(extracted);
            }
        }

        throw new TypeError('No case matched the given value');
    }, context);
};

module.exports = casesConstruct;

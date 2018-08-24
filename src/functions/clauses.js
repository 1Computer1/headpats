const ArrayPattern = require('../patterns/ArrayPattern');
const extractor = require('../util/extractor');
const GuardedPattern = require('../patterns/GuardedPattern');
const Pattern = require('../patterns/Pattern');

const clausesConstruct = () => {
    const context = {
        clauses: [],
        clause(...args) {
            if (args.length === 2) {
                this.clauses.push([new ArrayPattern(args[0]), args[1]]);
            }

            this.clauses.push([new ArrayPattern(args[0], args[1]), args[2]]);
            return this;
        },
        clauseGuarded(...args) {
            if (args.length === 3) {
                this.clauses.push([new GuardedPattern(new ArrayPattern(args[0]), args[1]), args[2]]);
            }

            this.clauses.push([new GuardedPattern(new ArrayPattern(args[0], args[1]), args[2]), args[3]]);
            return this;
        }
    };

    return Object.assign((...args) => {
        for (const [pattern, cb] of context.clauses) {
            const { matched, extracted } = Pattern.patternOf(pattern)[extractor](args, {});
            if (matched) {
                return cb(extracted);
            }
        }

        throw new TypeError('No clause matched the given arguments');
    }, context);
};

module.exports = clausesConstruct;

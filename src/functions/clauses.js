const { extractor } = require('../util/symbols');
const GuardedPattern = require('../patterns/GuardedPattern');
const Pattern = require('../patterns/Pattern');

const clauses = () => {
    const context = {
        clauses: [],
        clause(...args) {
            this.clauses.push([
                Pattern.patternOfArray(args.slice(0, -1)),
                args[args.length - 1]
            ]);

            return this;
        },
        clauseGuarded(...args) {
            this.clauses.push([
                new GuardedPattern(Pattern.patternOfArray(args.slice(0, -2)), args[args.length - 2]),
                args[args.length - 1]
            ]);

            return this;
        }
    };

    return Object.assign((...args) => {
        for (const [pattern, cb] of context.clauses) {
            const { matched, extracted } = pattern[extractor](args, {});
            if (matched) {
                return cb(extracted);
            }
        }

        throw new TypeError('No clause matched the given arguments');
    }, context);
};

module.exports = clauses;

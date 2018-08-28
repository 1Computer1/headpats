const functions = require('./functions');
const patterns = require('./patterns');
const symbols = require('./util/symbols');
const union = require('./union/union');
const UnionBase = require('./union/UnionBase');

module.exports = {
    // Symbols
    extractor: symbols.extractor,
    ignored: symbols.ignored,
    rest: symbols.rest,

    // Usable things
    patterns,
    functions,
    union,

    // Matcher aliases
    is: {
        id: id => new patterns.IDPattern(id),
        ignore: () => new patterns.IgnorePattern(),
        equal: value => new patterns.EqualPattern(value),
        oneOf: (...values) => new patterns.MultiplePattern(...values),
        inRange: (lowerBound, upperBound, exclusive = true) => new patterns.RangePattern(lowerBound, upperBound, exclusive),
        type: (type, pattern) => new patterns.TypePattern(type, pattern),
        instance: (Class, pattern) => new patterns.InstancePattern(Class, pattern),
        tag: (Class, pattern) => new patterns.TagPattern(Class, pattern),
        preguarded: (predicate, pattern) => new patterns.PreguardedPattern(predicate, pattern),
        guarded: (pattern, predicate) => new patterns.GuardedPattern(pattern, predicate),
        array: (...args) => new patterns.ArrayPattern(...args),
        object: (...args) => new patterns.ObjectPattern(...args),
        map: (...args) => new patterns.MapPattern(...args),
        string: (string, restPattern) => new patterns.StringPattern(string, restPattern),
        view: (fn, pattern) => new patterns.ViewPattern(fn, pattern),
        bind: (pattern, id) => new patterns.BindPattern(pattern, id)
    },

    // Matcher shortcuts
    $: new Proxy(id => new patterns.IDPattern(id), {
        get(self, property) {
            if (['toString', 'valueOf', 'inspect', 'constructor', Symbol.toPrimitive, Symbol.for('util.inspect.custom')].includes(property)) {
                return self[property];
            }

            return self(property);
        }
    }),
    $$: (thing, pattern) => typeof thing === 'string'
        ? new patterns.TypePattern(thing, pattern)
        : thing.prototype instanceof UnionBase
            ? new patterns.TagPattern(thing, pattern)
            : new patterns.InstancePattern(thing, pattern),
    _: new patterns.IgnorePattern(),

    // Shortcut functions
    case: (pattern, cb) => functions.cases().case(pattern, cb),
    caseGuarded: (pattern, predicate, cb) => functions.cases().caseGuarded(pattern, predicate, cb),
    clause: (...args) => functions.clauses().clause(...args),
    clauseGuarded: (...args) => functions.clauses().clauseGuarded(...args),
    test: (pattern, value) => functions.tester(pattern)(value),
    match: (pattern, value) => functions.matcher(pattern)(value)
};

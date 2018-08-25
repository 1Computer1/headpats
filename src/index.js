const extractor = require('./util/extractor');
const functions = require('./functions');
const ignored = require('./util/ignored');
const Pattern = require('./patterns/Pattern');
const patterns = require('./patterns');

module.exports = {
    // Symbols
    extractor,
    ignored,

    // Usable things
    Pattern,
    patterns,
    functions,

    // Matcher aliases
    is: {
        id: id => new patterns.IDPattern(id),
        ignore: () => new patterns.IgnorePattern(),
        equal: value => new patterns.EqualPattern(value),
        oneOf: (...values) => new patterns.MultiplePattern(...values),
        inRange: (lowerBound, upperBound, exclusive = true) => new patterns.RangePattern(lowerBound, upperBound, exclusive),
        type: (type, pattern) => new patterns.TypePattern(type, pattern),
        instance: (Class, pattern) => new patterns.InstancePattern(Class, pattern),
        preguarded: (predicate, pattern) => new patterns.PreguardedPattern(predicate, pattern),
        guarded: (pattern, predicate) => new patterns.GuardedPattern(pattern, predicate),
        array: (...args) => new patterns.ArrayPattern(...args),
        object: (...args) => new patterns.ObjectPattern(...args),
        map: (...args) => new patterns.MapPattern(...args),
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
    $$: (Class, pattern) => new patterns.InstancePattern(Class, pattern),
    _: new patterns.IgnorePattern(),

    // Shortcut functions
    case: (pattern, cb) => functions.cases().case(pattern, cb),
    caseGuarded: (pattern, predicate, cb) => functions.cases().caseGuarded(pattern, predicate, cb),
    clause: (...args) => functions.clauses().clause(...args),
    clauseGuarded: (...args) => functions.clauses().clauseGuarded(...args),
    test: (pattern, value) => functions.tester(pattern)(value),
    match: (pattern, value) => functions.matcher(pattern)(value)
};

const extractor = require('./util/extractor');
const functions = require('./functions');
const ignored = require('./util/ignored');
const Pattern = require('./patterns/Pattern');
const patterns = require('./patterns');

const fun = Class => (...args) => new Class(...args);

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
        id: fun(patterns.IDPattern),
        ignore: fun(patterns.IgnorePattern),
        equal: fun(patterns.EqualPattern),
        oneOf: fun(patterns.MultiplePattern),
        inRange: fun(patterns.RangePattern),
        type: fun(patterns.TypePattern),
        instance: fun(patterns.InstancePattern),
        preguarded: fun(patterns.PreguardedPattern),
        guarded: fun(patterns.GuardedPattern),
        array: fun(patterns.ArrayPattern),
        object: fun(patterns.ObjectPattern),
        map: fun(patterns.MapPattern),
        view: fun(patterns.ViewPattern),
        bind: fun(patterns.BindPattern)
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

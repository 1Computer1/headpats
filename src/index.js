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

    // Matcher shortcuts
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
        active: fun(patterns.ActivePattern),
        bind: fun(patterns.BindPattern)
    },
    $: id => new patterns.IDPattern(id),
    _: new patterns.IgnorePattern(),

    // Shortcut functions
    case: (pattern, cb) => functions.cases().case(pattern, cb),
    caseGuarded: (pattern, predicate, cb) => functions.cases().caseGuarded(pattern, predicate, cb),
    clause: (...args) => functions.clauses().clause(...args),
    clauseGuarded: (...args) => functions.clauses().clauseGuarded(...args),
    test: (pattern, value) => functions.tester(pattern)(value),
    match: (pattern, value) => functions.matcher(pattern)(value)
};

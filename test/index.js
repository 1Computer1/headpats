const assert = require('assert');
const should = (desc, fn) => {
    try {
        fn();
    } catch (err) {
        // eslint-disable-next-line no-console
        err.message = `Test to ${desc} did not pass.\n${err.message}`;
        throw err;
    }
};

const pat = require('../');
const { is, $, $$, _, rest } = pat;

should('match any value', () => {
    const fn = pat.case($.x, ({ x }) => x + 1);
    assert.strictEqual(fn(1), 2);
});

should('match any value and ignore it', () => {
    const fn = pat.case(_, o => o);
    assert.deepStrictEqual(fn(1), {});
});

should('match primitive values', () => {
    const fn = pat
        .case(1, () => 'one')
        .case(2, () => 'two');

    assert.strictEqual(fn(1), 'one');
    assert.strictEqual(fn(2), 'two');
});

should('match type with a string', () => {
    const fn = pat
        .case($$('string', $.x), ({ x }) => x.toUpperCase())
        .case($$('number', $.x), ({ x }) => x * 100);

    assert.deepStrictEqual(fn('hi'), 'HI');
    assert.deepStrictEqual(fn(1), 100);
});

should('match type with a class', () => {
    class X {}
    class Y {}

    const fn = pat
        .case($$(X, $.x), ({ x }) => x instanceof X)
        .case($$(Y, $.y), ({ y }) => y instanceof Y);

    assert.deepStrictEqual(fn(new X()), true);
    assert.deepStrictEqual(fn(new Y()), true);
});

should('throw an error for no match', () => {
    const fn = pat
        .case(1, () => 'one')
        .case(2, () => 'two');

    assert.throws(() => fn(100), /^TypeError: No case matched the given value$/);
});

should('match and bind the value', () => {
    const fn = pat.case(is.bind(1, 'x'), ({ x }) => x);
    assert.strictEqual(fn(1), 1);
});

should('throw an error when bind has same id', () => {
    const fn = pat.case(is.bind($.x, 'x'), ({ x }) => x);
    assert.throws(() => fn(1), /^TypeError: Cannot create binding of the same name as one of the bindings in contained pattern$/);
});

should('match a range', () => {
    const fn = pat
        .case(is.inRange(1, 10), () => 1)
        .case(_, () => 0);

    assert.strictEqual(fn(5), 1);
    assert.strictEqual(fn(10), 0);
});

should('match one of some values', () => {
    const fn = pat
        .case(is.oneOf(1, 2, 3), () => 1)
        .case(is.oneOf(4, 5, 6), () => 2);

    assert.strictEqual(fn(1), 1);
    assert.strictEqual(fn(4), 2);
});

should('match one of some patterns', () => {
    const fn = pat
        .case(is.oneOf($$('string', $.x), $$(String, $.x)), () => 1)
        .case(is.oneOf($$('number', $.x), $$(Number, $.x)), () => 2);

    assert.strictEqual(fn('a'), 1);
    assert.strictEqual(fn(4), 2);
    assert.strictEqual(fn(Object('a')), 1);
    assert.strictEqual(fn(Object(4)), 2);
});

should('match based on a preguard', () => {
    const fn = pat.case(is.preguarded(Array.isArray, $.a), ({ a }) => a[0]);
    assert.strictEqual(fn([1]), 1);
});

should('match based on a mapped value', () => {
    const fn = pat.case(is.view(a => a[0], 1), () => 1);
    assert.strictEqual(fn([1]), 1);
});

should('match with a guard', () => {
    const fn = pat
        .case(is.guarded($.x, ({ x }) => x > 10), ({ x }) => x)
        .case(_, () => 0);

    assert.strictEqual(fn(50), 50);
    assert.strictEqual(fn(1), 0);
});

should('match an empty array', () => {
    const fn = pat.case([], () => 0);
    assert.strictEqual(fn([]), 0);
});

should('match an array of a given length', () => {
    const fn = pat
        .case([_, $.x], ({ x }) => x)
        .case([_, _, $.x], ({ x }) => x);

    assert.strictEqual(fn([1, 2]), 2);
    assert.strictEqual(fn([1, 2, 3]), 3);
});

should('match the rest of an array', () => {
    const fn = pat.case([_, [rest, $.xs]], ({ xs }) => xs);
    assert.deepStrictEqual(fn([1, 2, 3]), [2, 3]);
});

should('throw an error when empty array does not match against array rest pattern with one element', () => {
    const fn = pat.case([_, [rest, $.xs]], ({ xs }) => xs);
    assert.throws(() => fn([]), /^TypeError: No case matched the given value$/);
});

should('match nested arrays', () => {
    const fn = pat
        .case([
            [
                [$.a, $.b],
                $.c
            ],
            [$.d]
        ], ({ a, b, c, d }) => [a, b, c, d]);

    assert.deepStrictEqual(fn([[[1, 2], 3], [4]]), [1, 2, 3, 4]);
});

should('match based on previous match', () => {
    const fn = pat
        .case([$.x, $.x], ({ x }) => x)
        .case([$.x, $.y], ({ x, y }) => x + y);

    assert.strictEqual(fn([1, 2]), 3);
    assert.strictEqual(fn([2, 2]), 2);
});

should('match an object', () => {
    const fn = pat
        .case({ x: $.x, y: $.y, z: $.z }, ({ x, y, z }) => (x ** 2) + (y ** 2) + (z ** 2))
        .case({ x: $.x, y: $.y }, ({ x, y }) => (x ** 2) + (y ** 2));

    assert.strictEqual(fn({ x: 2, y: 3 }), 13);
    assert.strictEqual(fn({ x: 2, y: 2, z: 3 }), 17);
});

should('match an object with inherited properties', () => {
    const fn = pat.case({ x: $.x }, ({ x }) => x);

    class A {
        constructor() {
            this.x = 1;
        }
    }

    assert.strictEqual(fn(new A()), 1);
});

should('match an object with symbol property', () => {
    const s = Symbol('s');
    const fn = pat.case({ [s]: $.x }, ({ x }) => x);
    assert.strictEqual(fn({ [s]: 1 }), 1);
});

should('match an object with rest properties', () => {
    const fn = pat.case({ x: 1, [rest]: $.xs }, ({ xs }) => xs);
    assert.deepStrictEqual(fn({ x: 1, y: 2, z: 3 }), { y: 2, z: 3 });
});

should('match a Map', () => {
    const fn = pat.case(new Map([['x', $.x]]), ({ x }) => x);
    assert.strictEqual(fn(new Map([['x', 5]])), 5);
});

should('match a Map with rest entries', () => {
    const fn = pat.case(new Map([['x', _], [rest, $.xs]]), ({ xs }) => xs);
    assert.deepStrictEqual(fn(new Map([['x', 5], ['y', 7]])), new Map([['y', 7]]));
});

should('match the start of a string', () => {
    const fn = pat.case(is.string('hello ', $.suffix), ({ suffix }) => suffix);
    assert.deepStrictEqual(fn('hello world'), 'world');
});

should('not match the start of a string', () => {
    const fn = pat.case(is.string('hello ', $.suffix), ({ suffix }) => suffix);
    assert.throws(() => fn('this is hello world'), /^TypeError: No case matched the given value$/);
});

should('test for a match using a helper function', () => {
    assert.strictEqual(pat.test(1, 1), true);
    assert.strictEqual(pat.test(1, 2), false);
});

should('extract a match using a helper function', () => {
    assert.deepStrictEqual(pat.match([$.x], [1]), { x: 1 });
    assert.strictEqual(pat.match([$.x], [1, 2]), null);
});

should('create a function with clauses', () => {
    const fn = pat
        .clause($.x, ({ x }) => x)
        .clause($.x, $.y, ({ x, y }) => x + y)
        .clause($.x, $.y, $.z, ({ x, y, z }) => x + y + z)
        .clause($.x, [rest, $.xs], ({ x, xs }) => xs.concat(x));

    assert.strictEqual(fn(1), 1);
    assert.strictEqual(fn(1, 2), 3);
    assert.strictEqual(fn(1, 2, 3), 6);
    assert.deepStrictEqual(fn(1, 2, 3, 4), [2, 3, 4, 1]);
});

should('create a function with guarded clauses', () => {
    const fn = pat
        .clauseGuarded($.x, ({ x }) => x === 1, ({ x }) => x)
        .clause(_, () => 0);

    assert.strictEqual(fn(1), 1);
    assert.strictEqual(fn(2), 0);
});

should('use a custom matcher', () => {
    class MyPattern extends pat.patterns.Pattern {
        [pat.extractor](value) {
            return value === 1
                ? { matched: true, extracted: { x: value } }
                : { matched: false };
        }
    }

    const fn = pat
        .case(new MyPattern(), ({ x }) => x)
        .case(_, () => 0);

    assert.strictEqual(fn(1), 1);
    assert.strictEqual(fn(6), 0);
});

should('do a map over an array', () => {
    const map = pat
        .clause([], _, () => [])
        .clause([$.x, [rest, $.xs]], $.f, ({ x, xs, f }) => [f(x)].concat(map(xs, f)));

    assert.deepStrictEqual(map([1, 2, 3, 4], x => x * 2), [2, 4, 6, 8]);
});

should('match a complicated thing', () => {
    const fn = pat
        .case({
            array: is.preguarded(Array.isArray, $.array),
            map: new Map([
                ['x', 1],
                ['y', 2]
            ]),
            object: {
                object2: {
                    object3: {
                        z: is.bind(is.inRange(1, 100), 'z'),
                        [rest]: $.xs
                    }
                }
            }
        }, o => o);

    assert.deepStrictEqual(fn({
        array: [1, 2, 3],
        map: new Map([
            ['x', 1],
            ['y', 2]
        ]),
        object: {
            object2: {
                object3: {
                    z: 10,
                    zz: 15
                }
            }
        }
    }), {
        array: [1, 2, 3],
        z: 10,
        xs: { zz: 15 }
    });
});

should('create a tagged union and check instanceof', () => {
    const Option = pat.union('Maybe', 'Some', 'None');

    const someOne = new Option.Some(1);
    assert.strictEqual(someOne instanceof Option, true);
    assert.strictEqual(someOne instanceof Option.Some, true);
    assert.strictEqual(someOne instanceof Option.None, false);
});

should('error if instantiating tagged union', () => {
    const Option = pat.union('Maybe', 'Some', 'None');
    assert.throws(() => new Option(), /^TypeError: This class may not be instantiated$/);
});

should('create a tagged union and pattern match value kind', () => {
    const Option = pat.union('Maybe', 'Some', 'None');

    const someOne = new Option.Some(1);
    assert.deepStrictEqual(pat.match($$(Option.Some, $.x), someOne), { x: 1 });
    assert.deepStrictEqual(pat.match(is.instance(Option.Some, $.x), someOne), { x: someOne });
});

should('create a tagged union and pattern match array kind', () => {
    const Tree = pat.union('Tree', ['Branch', 'array'], 'Leaf');

    const tree = new Tree.Branch(new Tree.Leaf(1), new Tree.Leaf(2));
    assert.deepStrictEqual(pat.match($$(Tree.Branch, [$$(Tree.Leaf, $.l1), $$(Tree.Leaf, $.l2)]), tree), { l1: 1, l2: 2 });
});

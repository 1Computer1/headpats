# Headpats

Pattern matching in JavaScript without new syntax.  

## Examples

**Stringly Typed Function**

```js
function doOperation(operation, a, b) {
    return pat
        .case('add', () => a + b)
        .case('minus', () => a - b)
        .case(_, () => NaN)(operation);
}
```

**Safe Traversal**

```js
const o = { x: { y: { z: 10 } } };
pat.match({ x: { y: { z: $('z') } } }, o) // → { z: 10 }
pat.match({ x: { y: { what: $('what') } } }, o) // → null
```

**Recusive Map**

```js
const map = pat
    .clause([[], _], () => [])
    .clause([is.array([$('x')], $('xs')), $('f')], ({ x, xs, f }) => [f(x)].concat(map(xs, f)));

map([1, 2, 3, 4], x => x * 2) // → [2, 4, 6, 8]
```

**Option**

```js
class Option {}
class None extends Option {}
class Some extends Option {
    constructor(x) {
        this.x = x;
    }
}

const double = pat
    .case(is.instance(Some, { x: $('x') }), ({ x }) => new Some(x * 2))
    .case(_, () => new None());

double(new Some(5)) // → Some { x: 10 }
double(new None()) // → None {}
```

## Pattern Matching Protocol

The library exposes the `extractor` and `ignored` symbols which are used in the pattern matching protocol.  

An object that implements pattern matching has a `@@extractor` function which takes in two arguments, the `value` of the thing to match, and `previousExtracted` which is an object containing any previous extracted values.  
It must return an object with a property `matched` containing a boolean on whether a match was made and if it did, a property `extracted` containing an object of extracted values.  

The object can also have a boolean `@@ignored` property.  
This indicates that the pattern matching will ignore the value to match with, allowing for some optimizations.  

The library also contains a `Pattern` abstract class for extending, containing utility methods.  
The static method `patternOf` takes in a value, and if it has `@@extractor`, return it, otherwise:

- If the value is primitive, wrap it in an `EqualPattern`.
- If the value is an array, pass it to `ArrayPattern`.
- If the value is a `Map`, pass it to `MapPattern`.
- Otherwise, pass it to `ObjectPattern`.

When pattern constructors expect a pattern to be passed in, `Pattern.patternOf` should be ran to ensure it has `@@extractor`. 
The `Pattern` class also has the methods `test` and `match` corresponding to the built-in `tester` and `matcher` functions.  

Example of a custom pattern:  

```js
class NotEqualAndBindPattern extends Pattern {
    constructor(value, id) {
        super();
        this.value = value;
        this.id = id;
    }

    [extractor](value, previousExtracted) {
        if (this.id in previousExtracted && value !== previousExtracted[this.id]) {
            return { matched: false };
        }

        return value !== this.value
            ? { matched: true, extracted: { [this.id]: value } }
            : { matched: false };
    }
}

// This object implements the protocol.
const pattern = new NotEqualAndBindPattern(10, 'x');
pattern[extractor](10, {}) // → { matched: false }
pattern[extractor](11, {}) // → { matched: true, extracted: { x: 11 } }
pattern[extractor](11, { x: 5 }) // → { matched: false }
```

The built-in patterns below all implement this protocol and can be used in the built-in functions below.  

## Built-In Patterns

The library contains built-in patterns contained in the `patterns` object with shortcuts to create them in the `is` object.  
Below, any instatiated class refers to a class in the `patterns` object, any functions prefixed with `is` refers to one in the `is` object, and any other name refers to one on the library index object.  

**ID**  

- `new IDPattern(id)`  
- `is.id(id)`  
- `$(id)`  

Creates a pattern that matches any value and extracts it to `id` in the `extracted` object.  
If `previousExtracted` already has a key `id`, the value from there must be equal for the given value for a match.  

**Ignore**  

- `new IgnorePattern()`
- `is.ignore()`
- `_`

Creates a pattern that matches any value.  
The `_` shortcut is an already instantiated `IgnorePattern` so it can be used immediately.  

**Equal**  

- `new EqualPattern(value)`
- `is.equal(value)`

Creates a pattern that matches if the given value is equal using strict equality (`===`) with the `value`.  

**Multiple**  

- `new MultiplePattern(...values)`
- `is.oneOf(...values)`

Creates a pattern that matches if the given value is equal using strict equality (`===`) to any one of the `values`.  

**Range**  

- `new RangePattern(lowerBound, upperBound[, exclusive = true])`
- `is.inRange(lowerBound, upperBound[, exclusive = true])`

Creates a pattern that matches if the given value is within a range.  
JavaScript allows this to work with numbers, strings, and bigints.  

**Type**  

- `new TypePattern(type, pattern)`
- `is.type(type, pattern)`

Creates a pattern that matches if the `typeof` the given value is equal to `type` and that `pattern` also matches.  
The `extracted` object that `pattern` extracts is used.  

**Instance**  

- `new InstancePattern(Class, pattern)`
- `is.instance(Class, pattern)`

Creates a pattern that matches if the given value is an `instanceof Class` and that `pattern` also matches.  
The `extracted` object that `pattern` extracts is used.  

**Preguarded**  

- `new PreguardedPattern(predicate, pattern)`
- `is.preguarded(predicate, pattern)`

Creates a pattern that matches if the `predicate` of the given value is true and that `pattern` also matches.  
The `extracted` object that `pattern` extracts is used.  

**Guarded**  

- `new GuardedPattern(pattern, predicate)`
- `is.guarded(pattern, predicate)`

Creates a pattern that matches if the `pattern` matches and the `predicate` of the `extracted` object from `pattern` is true.  
The `extracted` object that `pattern` extracts is used.  

**Array**  

- `new ArrayPattern(patterns[, restPattern])`
- `is.array(patterns[, restPattern])`

Here, `patterns` must be an array.  
It creates a pattern that matches if:  

- The given value is an array.
- The given value has a length equal to the length of `patterns` or has a length at least equal to the length of `patterns` if a `restPattern` was given.
- Every pattern in `patterns` matches the corresponding element in the given value.
- The `restPattern` matches the rest of the array if it was given.

The `previousExtracted` object is updated after every pattern match in `patterns`.  

**Object**  

- `new ObjectPattern(patterns[, restPattern])`
- `is.object(patterns[, restPattern])`

Here, `patterns` must be an object.  
It creates a pattern that matches if:  

- The given value is an object.
- Every key in `patterns` exists in the given value.
- Every (key, pattern) in `patterns` matches the corresponding (key, value) in the given value.
- The `restPattern` matches the rest of the object (using own property names and symbols) if it was given.

The `previousExtracted` object is updated after every pattern match in `patterns`.  

**Map**  

- `new MapPattern(patterns[, restPattern])`
- `is.map(patterns[, restPattern])`

Here, `patterns` must be a `Map`.  
It creates a pattern that matches if:  

- The given value is a `Map`.
- Every key in `patterns` exists in the given value.
- Every (key, pattern) in `patterns` matches the corresponding (key, value) in the given value.
- The `restPattern` matches the rest of the map if it was given.

The `previousExtracted` object is updated after every pattern match in `patterns`.  

**View**

- `new ViewPattern(fn, pattern)`
- `is.view(fn, pattern)`

Creates a pattern that matches if `fn` of the given value matches the `pattern`.  
This is used to map a value into another for another pattern.  
The `extracted` object that `pattern` extracts is used.  

**Bind**

- `new BindPattern(pattern, id)`
- `is.bind(pattern, id)`

Creates a pattern that matches the given value with `pattern`.  
The original given value is then added to the `extracted` object with key `id`.  
The `extracted` object must not have a key the same as `id`, i.e. `pattern` cannot extract something with the same key as the bind pattern's `id`.  
If `previousExtracted` already has a key `id`, the value from there must be equal for the given value for a match.  

## Functions

The library contains several function builders contained in the `functions` object with shortcuts to them on the library index object.  
Below, all functions to refer to one in the `functions` object, with the shortcut noted.  

**Matching Case By Case**  

- `cases()`

Creates a new cases function.  
A new case branch can be added with one of the following on the `cases()` object:  

- `case(patterns, callback)`
- `caseGuarded(patterns, predicate, callback)`

The `predicate` will take the `extracted` object and will return a boolean for whether the extracted values passed.  
The `callback` will take the `extracted` object and can return anything.  

Once all cases are added, the `cases()` object itself can be called with a value to match.  
It will match the given value through all the cases until one is found and runs its `callback`.  
If no case matches, an error is thrown.   

The shortcut functions `case` and `caseGuarded` on the library index is a shortcut to `cases().case` and `cases().caseGuarded`.  

**Function with Clauses**  

- `clauses()`

Creates a new clauses function.  
A new clause branch can be added with one of the following on the `clauses()` object:  

- `clause(patterns, callback)`
- `clause(patterns, restPattern, callback)`
- `clauseGuarded(patterns, predicate, callback)`
- `clauseGuarded(patterns, restPattern, predicate, callback)`

Here, `patterns` is an array of patterns corresponding to the passed-in arguments.  
The `predicate` will take the `extracted` object and will return a boolean for whether the extracted values passed.  
The `callback` will take the `extracted` object and can return anything.  

Once all clauses are added, the `clauses()` object itself can be called with a parameter list.  
It will match the arguments through all the clauses until one is found and runs its `callback`.  
If no clause matches, an error is thrown.   

The shortcut functions `clause` and `clauseGuarded` on the library index is a shortcut to `clauses().clause` and `clauses().clauseGuarded`.  

**Test Match**  

- `tester(pattern)`

Creates a new test function.  
The return of `tester(pattern)` can then be called on a value to test if it matches.  
A pattern extending `Pattern` can also use `Pattern#test(value)`.  

The shortcut function `test(pattern, value)` on the library index is a shortcut to `tester(pattern)(value)`.  

**Get Match**  

- `matcher(pattern)`

Creates a new match function.  
The return of `matcher(pattern)` can then be called on a value to get the `extracted` object if it matched, otherwise `null`.  
A pattern extending `Pattern` can also use `Pattern#match(value)`.  

The shortcut function `match(pattern, value)` on the library index is a shortcut to `matcher(pattern)(value)`.  

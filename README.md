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

pat.match({ x: { y: { z: $.z } } }, o)
→ { z: 10 }

pat.match({ x: { y: { what: $.what } } }, o)
→ null
```

**Recursive Map**

```js
const map = pat
    .clause([], _, () => [])
    .clause([$.x, [rest, $.xs]], $.f, ({ x, xs, f }) => [f(x)].concat(map(xs, f)));

map([1, 2, 3, 4], x => x * 2)
→ [2, 4, 6, 8]
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
    .case($$(Some, { x: $.x }), ({ x }) => new Some(x * 2))
    .case(_, () => new None());

double(new Some(5))
→ Some { x: 10 }

double(new None())
→ None {}
```

## Documentation

Refer to the [documentation folder](./docs) for information on how to implement pattern matching and built-in features.  

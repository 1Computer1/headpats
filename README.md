# Headpats

Pattern matching in JavaScript without new syntax.  
See the [guide](./docs/0.%20How%20to%20Use.md) on how to use Headpats!  
Refer to the [documentation](./docs) for specific information on pattern matching and built-in features.  

## Examples

**Setup**  

```js
const pat = require('headpats');
const { $, $$, _, is, rest } = pat;
```

**Stringly Typed**  

```js
function doOperation(operation, a, b) {
    return pat
        .case('add', () => a + b)
        .case('minus', () => a - b)
        .case(_, () => NaN)(operation);
}

doOperation('add', 1, 2)
→ 3

doOperation('minus', 1, 2)
→ -1

doOperation('something', 1, 2)
→ NaN
```

**Safe Traversal**  

```js
const o = { x: { y: { z: 10 } } };

pat.match({ x: { y: { z: $.z } } }, o)
→ { z: 10 }

pat.match({ x: { y: { what: $.what } } }, o)
→ null
```

**Result Matching**  

```js
const ok = Symbol('ok');
const err = Symbol('err');

function divide(a, b) {
    if (b === 0) {
        return [err, null];
    }

    return [ok, a / b];
}

pat.match([ok, $.num], divide(10, 2));
→ { num: 5 }
```

**Option Enum**  

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
    .case($$(None, _), () => new None());

double(new Some(5))
→ Some { x: 10 }

double(new None())
→ None {}

double(100)
→ Error
```

**Recursive Map**  

```js
const map = pat
    .clause([], _, () => [])
    .clause([$.x, [rest, $.xs]], $.f, ({ x, xs, f }) => [f(x)].concat(map(xs, f)));

map([1, 2, 3, 4], x => x * 2)
→ [2, 4, 6, 8]
```

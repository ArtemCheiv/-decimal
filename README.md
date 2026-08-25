# decimal-js

An arbitrary-precision Decimal type for JavaScript.

**Made by [ArtemCheiv](https://github.com/ArtemCheiv).**

## Features

- Integers and floats
- Simple but full-featured API
- Replicates many of the methods of JavaScript's `Number.prototype` and `Math` objects
- Handles hexadecimal, binary, and octal values
- Faster, smaller, and easier to use than JavaScript versions of Java's BigDecimal
- No dependencies
- Wide platform compatibility: browsers and Node.js
- Comprehensive [documentation](doc/API.html) and test set
- Includes a TypeScript declaration file: `decimal.d.ts`

Unlike [bignumber.js](https://github.com/MikeMcl/bignumber.js/), precision here is specified in significant digits rather than decimal places, and all calculations are rounded to that precision (similar to Python's `decimal` module), not only divisions.

This library also adds trigonometric functions and supports non-integer powers. For a lighter version without trigonometric functions, see [decimal.js-light](https://github.com/MikeMcl/decimal.js-light/).

## Install

```bash
npm install decimal-js
```

The library is the single JavaScript file `decimal.js` or the ES module `decimal.mjs`.

**Browser:**

```html
<script src="path/to/decimal.js"></script>

<script type="module">
  import Decimal from './path/to/decimal.mjs';
</script>
```

**Node.js:**

```js
const Decimal = require('decimal-js');

import Decimal from 'decimal-js';

import { Decimal } from 'decimal-js';
```

## Use

In the examples below, semicolons and `toString` calls are omitted. If a commented-out value is in quotes, `toString` has been called on the preceding expression.

The library exports a single constructor, `Decimal`, which expects a number, string, bigint, or Decimal instance.

```js
x = new Decimal(123.4567)
y = new Decimal('123456.7e-3')
z = new Decimal(x)
x.equals(y) && y.equals(z) && x.equals(z)        // true
```

If a value has more than a few digits, pass a string rather than a number to avoid precision loss.

```js
// Precision loss from numeric literals with more than 15 significant digits.
new Decimal(1.0000000000000001)         // '1'
new Decimal(88259496234518.57)          // '88259496234518.56'
new Decimal(99999999999999999999)       // '100000000000000000000'

// Precision loss from numeric literals outside the range of Number.
new Decimal(2e+308)                     // 'Infinity'
new Decimal(1e-324)                     // '0'

// Precision loss from arithmetic with Number values.
new Decimal(0.7 + 0.1)                  // '0.7999999999999999'
```

Strings can contain underscores as separators.

```js
x = new Decimal('2_147_483_647')
```

Binary, hexadecimal, and octal strings are accepted when they include the appropriate prefix.

```js
x = new Decimal('0xff.f')            // '255.9375'
y = new Decimal('0b10101100')        // '172'
z = x.plus(y)                        // '427.9375'

z.toBinary()                         // '0b110101011.1111'
z.toBinary(13)                       // '0b1.101010111111p+8'
```

Decimal instances are immutable: methods return new values and do not change the original.

```js
0.3 - 0.1                     // 0.19999999999999998
x = new Decimal(0.3)
x.minus(0.1)                  // '0.2'
x                             // '0.3'
```

Methods that return a Decimal can be chained.

```js
x.dividedBy(y).plus(z).times(9).floor()
x.times('1.23456780123456789e+9').plus(9876.5432321).dividedBy('4444562598.111772').ceil()
```

Many methods have a shorter alias.

```js
x.squareRoot().dividedBy(y).toPower(3).equals(x.sqrt().div(y).pow(3))     // true
x.comparedTo(y.modulo(z).negated()) === x.cmp(y.mod(z).neg())             // true
```

Most methods of JavaScript's `Number.prototype` and `Math` objects are replicated.

```js
x = new Decimal(255.5)
x.toExponential(5)                       // '2.55500e+2'
x.toFixed(5)                             // '255.50000'
x.toPrecision(5)                         // '255.50'

Decimal.sqrt('6.98372465832e+9823')      // '8.3568682281821340204e+4911'
Decimal.pow(2, 0.0979843)                // '1.0702770511687781839'

x = new Decimal('0.0000001')
x.toString()                             // '1e-7'
x.toFixed()                              // '0.0000001'
```

`NaN` and `Infinity` are valid Decimal values.

```js
x = new Decimal(NaN)                                           // 'NaN'
y = new Decimal(Infinity)                                      // 'Infinity'
x.isNaN() && !y.isNaN() && !x.isFinite() && !y.isFinite()      // true
```

`toFraction` accepts an optional maximum denominator.

```js
z = new Decimal(355)
pi = z.dividedBy(113)        // '3.1415929204'
pi.toFraction()              // [ '7853982301', '2500000000' ]
pi.toFraction(1000)          // [ '355', '113' ]
```

All calculations are rounded according to the `precision` and `rounding` properties of the Decimal constructor.

Multiple Decimal constructors can be created, each with its own independent configuration.

```js
Decimal.set({ precision: 5, rounding: 4 })

Dec = Decimal.clone({ precision: 9, rounding: 1 })

x = new Decimal(5)
y = new Dec(5)

x.div(3)                           // '1.6667'
y.div(3)                           // '1.66666666'
```

The value of a Decimal is stored as digits, exponent, and sign. Treat these properties as read-only.

```js
x = new Decimal(-12345.67)
x.d                            // [ 12345, 6700000 ]    digits (base 10000000)
x.e                            // 4                     exponent (base 10)
x.s                            // -1                    sign
```

See the [API reference](doc/API.html) for the full method list.

## Extensions

This fork adds helpers that keep the original Decimal API intact:

```js
Decimal.version                    // '11.0.0'

x = Decimal.from('1e-7')
x.toPlainString()                  // '0.0000001'
x.copy().eq(x)                     // true
x.shift(3)                         // '0.0001'

new Decimal(42).isSafeInteger()    // true
new Decimal(42).toBigInt()         // 42n

Decimal.tryFrom('oops')            // null
Decimal.pi().toSD(5)               // '3.1416'
Decimal.e().toSD(5)                // '2.7183'

Decimal.config({ precision: 8 })
Decimal.reset()                    // restore defaults
```

Invalid values throw a `Decimal.Error` (a subclass of `Error`) whose message still starts with `[DecimalError]`.

## Configuration

| Property | Default | Description |
| --- | --- | --- |
| `precision` | `20` | Maximum significant digits of a calculation |
| `rounding` | `4` (`ROUND_HALF_UP`) | Rounding mode |
| `minE` | `-9e15` | Minimum exponent |
| `maxE` | `9e15` | Maximum exponent |
| `toExpNeg` | `-7` | Exponent at and beneath which `toString` uses exponential notation |
| `toExpPos` | `21` | Exponent at and above which `toString` uses exponential notation |
| `modulo` | `1` | Remainder mode for `mod` |
| `crypto` | `false` | Use cryptographically secure random values |

Rounding modes:

| Constant | Value | Behaviour |
| --- | --- | --- |
| `ROUND_UP` | `0` | Away from zero |
| `ROUND_DOWN` | `1` | Towards zero |
| `ROUND_CEIL` | `2` | Towards `+Infinity` |
| `ROUND_FLOOR` | `3` | Towards `-Infinity` |
| `ROUND_HALF_UP` | `4` | Nearest neighbour; if equidistant, up |
| `ROUND_HALF_DOWN` | `5` | Nearest neighbour; if equidistant, down |
| `ROUND_HALF_EVEN` | `6` | Nearest neighbour; if equidistant, towards even |
| `ROUND_HALF_CEIL` | `7` | Nearest neighbour; if equidistant, towards `+Infinity` |
| `ROUND_HALF_FLOOR` | `8` | Nearest neighbour; if equidistant, towards `-Infinity` |
| `EUCLID` | `9` | Euclidean division (modulo) |

```js
Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_UP
})
```

## Test

From the project root:

```bash
npm test
```

Run a single test module:

```bash
node test/modules/toFraction
```

To run the tests in a browser, open `test/test.html`.

## Licence

[The MIT Licence](LICENCE.md)

Made by ArtemCheiv.

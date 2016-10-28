english | [中文](https://github.com/cnlon/ob.js/blob/master/README.zh.md)

# ob.js

[![Build Status](https://travis-ci.org/cnlon/ob.js.svg?branch=master)](https://travis-ci.org/cnlon/ob.js)
[![npm version](https://badge.fury.io/js/ob.js.svg)](https://badge.fury.io/js/ob.js)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)


**ob.js** comes from [**vue.js**](https://github.com/vuejs/vue). It's a small, efficient library for observing changes to javascript Object, Array and Class.

## Installation

``` bash
npm install --save ob.js
```

#### Bower
``` bash
bower install --save ob.js
```

## Usage

#### To watch expression. `ob.watch(target, expression, callback)` or `ob(target, expression, callback)`

Try it on:
[codepen](http://codepen.io/lon/pen/rrqLLk?editors=0010#0)
[jsfiddle](https://jsfiddle.net/lon/x4n2yjLn/)

``` javascript
const target = {a: 1}
ob(target, 'a', function (newValue, oldValue) {
  console.log(`a: ${newValue}`)
  console.log(newValue === this.a) // 'this' has bound to target
})
target.a = 3
// a: 3
// true
```

#### To add computed property. `ob.compute(target, name, getter)`

Try it on:
[codepen](http://codepen.io/lon/pen/dpgXLN?editors=0010#0)
[jsfiddle](https://jsfiddle.net/lon/q402v3jd/)

``` javascript
class Claz {
  constructor () {
    this.a = 1
    ob.compute(this, 'b', () => this.double(this.a)) // Be careful with 'this' when using arrow function
  }
  double (num) {
    return num * 2
  }
}
const target = new Claz()
console.log(`b: ${target.b}`)
// b: 2
target.a = 3
console.log(`b: ${target.b}`)
// b: 6
```

#### To watch expressions and computed properties. `ob.react(options)`

Try it on:
[codepen](http://codepen.io/lon/pen/zKmKqA?editors=0010#0)
[jsfiddle](https://jsfiddle.net/lon/ufth8xpe/)

``` javascript
const options = {
  data: {
    PI: Math.PI,
    radii: 1,
  },
  computed: {
    'area': function () {
      return this.PI * this.square(this.radii) // πr²
    },
  },
  watchers: {
    'area': function (newValue, oldValue) {
      console.log(`area: ${newValue}`)
    },
  },
  methods: {
    square (num) {
      return num * num
    },
  },
}
const target = ob.react(options)
target.radii = 3
// area: 28.274333882308138
```

## API

#### properties

| name | type | value | detail |
| --- | --- | --- | --- |
| `ob.deep` | `Boolean` | The default is `false` | If `true`, `ob.watch(target, expression, callback)` will observe `target` deeply |
| `ob.sync` | `Boolean` | The default is `false` | If `true`, `ob.watch(target, expression, callback)` will invoke callback immediately when a property change is detected |
| `ob.default` | `Function` | Could only be one of `ob.react`, `ob.watch` and `ob.compute`. The default is `ob.watch` | Set actual method to `ob.default` for `ob(...)` |

#### methods

**`ob(...)`**

- It's syntactic sugar of `ob.default`. See 'properties' for details

**`ob.watch(target, expression, callback)`**

- `target`: Any object
- `expression`: `String` or `Function`
- `callback`: `Function`
- Returns `Watcher`. And calling `watcher.teardown()` could unwatch expression

**`ob.compute(target, name, accessor, cache)`**

- `target`: Any object
- `name`: `String`
- `accessor`:
  - `Function`: It will be the `get` of accessor
  - `Object`: Contains: (at least `get` or `set`)
    - `get`: `Function`
    - `set`: `Function`
    - `cache`: `Boolean`. Optional. The default is `true`. If `false`, the `get` will be evaluated whenever reading computed properties
- `cache`: `Boolean`. Same as `accessor.cache`

**`ob.react(options, target)`**

- `options`: `Object`. Contains:
  - `data`: It's the properties to add
  - `computed`: It's the computed properties to add
  - `watchers`: It's the watchers to watch properties or computed properties
  - `methods`: The methods to add. And these will bind to `target`
- `target`: Any object. Optional. The default is empty object. It will be attached with the fields of `options`
- returns `target`

## License

[MIT](http://opensource.org/licenses/MIT)

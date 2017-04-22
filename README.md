English | [中文](https://github.com/cnlon/smart-observe/blob/master/README.zh.md)

# smart-observe

[![Build Status](https://travis-ci.org/cnlon/smart-observe.svg?branch=master)](https://travis-ci.org/cnlon/smart-observe)
[![npm version](https://badge.fury.io/js/smart-observe.svg)](https://badge.fury.io/js/smart-observe)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)


**smart-observe** comes from [**Vue.js**](https://github.com/vuejs/vue). It's a small, efficient library for observing changes to javascript Object, Array and Class.

## Installation

``` bash
npm install --save smart-observe
```

or

``` bash
bower install --save smart-observe
```

## Usage

#### To watch expression. `observe.watch(target, expression, callback)` or `observe(target, expression, callback)`

Try it on:
[codepen](http://codepen.io/lon/pen/rrqLLk?editors=0010#0)
[jsfiddle](https://jsfiddle.net/lon/x4n2yjLn/)

``` javascript
const target = {a: 1}
observe(target, 'a', function (newValue, oldValue) {
  console.log(newValue, oldValue)
})
target.a = 3
// 3 1
```

#### To add computed property. `observe.compute(target, name, getter)`

Try it on:
[codepen](http://codepen.io/lon/pen/dpgXLN?editors=0010#0)
[jsfiddle](https://jsfiddle.net/lon/q402v3jd/)

``` javascript
const target = {a: 1}
observe.compute(target, 'b', function () {
  return this.a * 2
})
console.log(target.b)
// 2
target.a = 3
console.log(target.b)
// 6
```

#### To watch expressions and computed properties. `observe.react(options)`

Try it on:
[codepen](http://codepen.io/lon/pen/zKmKqA?editors=0010#0)
[jsfiddle](https://jsfiddle.net/lon/ufth8xpe/)

``` javascript
const options = {
  data: {
    PI: Math.PI,
    radius: 1,
  },
  computed: {
    'area': function () {
      return this.PI * this.square(this.radius) // πr²
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
const target = observe.react(options)
target.radius = 3
// area: 28.274333882308138
```

## API

#### properties

| name | type | value | detail |
| --- | --- | --- | --- |
| `observe.deep` | `Boolean` | The default is `false` | If `true`, `observe.watch(target, expression, callback)` will observe `target` deeply |
| `observe.sync` | `Boolean` | The default is `false` | If `true`, `observe.watch(target, expression, callback)` will invoke callback immediately when a property change is detected |
| `observe.default` | `Function` | Could only be one of `observe.react`, `observe.watch` and `observe.compute`. The default is `observe.watch` | Set actual method to `observe.default` for `observe(...)` |

#### methods

**`observe(...)`**

- It's syntactic sugar of `observe.default`. See 'properties' for details

**`observe.watch(target, expression, callback)`**

- `target`: Any object
- `expression`: `String` or `Function`
- `callback`: `Function`
- Returns `Watcher`. And calling `watcher.teardown()` could unwatch expression

**`observe.compute(target, name, accessor, cache)`**

- `target`: Any object
- `name`: `String`
- `accessor`:
  - `Function`: It will be the `get` of accessor
  - `Object`: Contains: (at least `get` or `set`)
    - `get`: `Function`
    - `set`: `Function`
    - `cache`: `Boolean`. Optional. The default is `true`. If `false`, the `get` will be evaluated whenever reading computed properties
- `cache`: `Boolean`. Same as `accessor.cache`

**`observe.react(options, target)`**

- `options`: `Object`. Contains:
  - `data`: It's the properties to add
  - `computed`: It's the computed properties to add
  - `watchers`: It's the watchers to watch properties or computed properties
  - `methods`: The methods to add. And these will bind to `target`
- `target`: Any object. Optional. The default is empty object. It will be attached with the fields of `options`
- returns `target`

## License

[MIT](https://github.com/cnlon/smart-observe/blob/master/LICENSE)

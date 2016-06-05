# ob.js

[![Build Status](https://travis-ci.org/longhaohe/ob.js.svg?branch=master)](https://travis-ci.org/longhaohe/ob.js)
[![npm version](https://badge.fury.io/js/ob.js.svg)](https://badge.fury.io/js/ob.js)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)


ob.js comes from [vue.js](https://github.com/vuejs/vue) and is a small and efficient library used to observe Object, Array and Class.


## Installation
``` bash
npm install --save ob.js
```

## Usage

First
``` javascript
var ob = require('ob.js')
```
or
``` javascript
import ob from 'ob.js'
```
Then

#### ob(obj, prop, callback)

``` javascript
var obj = {
  a: 1,
}
ob(obj, 'a', function (newVal, oldVal) {
  console.log(newVal, oldVal) // 2 1
})
obj.a = 2
```

#### ob(obj).watch(prop, callback)

``` javascript
var obj = {
  a: 1,
}
ob(obj).watch('a', function (newVal, oldVal) {
  console.log(newVal, oldVal) // 2 1
})
obj.a = 2
```

#### ob(obj).compute(prop, getter)

``` javascript
var obj = {
  a: 1,
}
ob(obj).compute('b', function () {
  return this.a * 2
}
console.log(obj.b) // 2
obj.a = 3
console.log(obj.b) // 6
```

#### ob(obj).reactive(options)

``` javascript
var obj = {
  a: 1,
}
var options = {
  data: {
    b: 2,
  },
  computed: {
    'c': function () {
      return this.square(this.a) + this.square(this.b)
    },
  },
  watchers: {
    'c': function (newVal, oldVal) {
      console.log(newVal, oldVal) // 13 5
    },
  },
  methods: {
    square: function (num) {
      return num * num
    }
  },
}
ob(obj).reactive(options)
obj.a = 3
```

## API

#### properties

**ob.default**

`Function`, `ob.watch` default.

Used for `ob(obj, prop, callback)`. You can set with `ob.compute`

**ob.reative.auto**

`Boolean`, `true` default.

Used for `ob(obj, prop, callback)`. If `true`, it will be called with `obj`.

**ob.watch.deep**

`Boolean`, `false` default.

Used for `ob.watch(prop, callback)`.

**ob.watch.sync**

`Boolean`, `false` default.

Used for `ob.watch(prop, callback)`. If `true`, call `callback` immediately not by batcher after `obj.prop` changed.

#### methods

**ob(obj, prop, callback)**

| param | type |
| --- | --- |
| obj | `Object`, required. |
| prop | `String`, optional |
| callback | `Function`, optional |

What is `ob(...)`  doing?

1. Set `current` with `obj`
2. If `obj` has not been initiated, init it. And then call `ob.reative()` if `ob.reative.auto` is `true`.
3. Call `ob.default` with prop and callback, if existing.

**ob.reactive(options)**

| param | type |
| --- | --- |
| options | `Object`, required. |

Before calling `ob.reactive`, you should tell it who is `current` by:

``` javascript
// var obj = {...}, options = {...}
ob(obj)
ob.reactive(options)
```

or

``` javascript
// var obj = {...}, options = {...}
ob(obj).reactive(options)
```

See [above](#obobjreactiveoptions) for example

**ob.watch(prop, callback)**

| param | type |
| --- | --- |
| prop | `String`, required. |
| callback | `Function`, required. |

See [above](#obobjwatchprop-callback) for example

**ob.compute(prop, accessor)**

| param | type |
| --- | --- |
| prop | `String`, required. |
| accessor | `Function`\|`Object`, required. |

if `accessor` is an `Object`, it should like:

``` javascript
{
  get: function () {
    // return something
  },
  set: function (val) { // optional
    // do something
  }
}
```

See [above](#obobjcomputeprop-getter) for example

## Contributing

Thanks so much for wanting to help! We really appreciate it.

- Have an idea for a new feature?
- Want to add a new built-in theme?

Excellent! You've come to the right place.

1. If you find a bug or wish to suggest a new feature, please create an issue first
2. Make sure your code conventions are in-line with the project's style
3. Make your commits and PRs as tiny as possible - one feature or bugfix at a time
4. Write detailed commit messages, in-line with the project's commit naming conventions

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016 longhao

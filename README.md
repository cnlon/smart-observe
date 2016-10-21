中文 | [english](https://github.com/cnlon/ob.js/blob/master/README.en.md)

# ob.js

[![Build Status](https://travis-ci.org/cnlon/ob.js.svg?branch=master)](https://travis-ci.org/cnlon/ob.js)
[![npm version](https://badge.fury.io/js/ob.js.svg)](https://badge.fury.io/js/ob.js)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

**ob.js** 来自 [**vue.js**](https://github.com/vuejs/vue)，是一个小巧、高效，用于监测 javascript 对象、数组、类 变化的库

## 安装

#### NPM
``` bash
npm install --save ob.js
```

#### Bower
``` bash
bower install --save ob.js
```

## 使用

#### 监测属性 `ob.watch(target, expression, callback)` 或 `ob(target, expression, callback)`

试一试：
[codepen](http://codepen.io/lon/pen/rrqLLk?editors=0010#0)
[jsfiddle](https://jsfiddle.net/lon/x4n2yjLn/)

``` javascript
const target = {a: 1}
ob(target, 'a', function (newValue, oldValue) {
  console.log(`a: ${newValue}`)
  console.log(newValue === this.a) // this 会自动绑定至 target
})
target.a = 3
// a: 3
// true
```

#### 添加计算属性 `ob.compute(target, name, getter)`

试一试：
[codepen](http://codepen.io/lon/pen/dpgXLN?editors=0010#0)
[jsfiddle](https://jsfiddle.net/lon/q402v3jd/)

``` javascript
class Claz {
  constructor () {
    this.a = 1
    ob.compute(this, 'b', () => this.double(this.a)) // 使用箭头函数要小心 this 绑定
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

#### 监测属性并添加计算属性 `ob.react(options)`

试一试：
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

#### 属性

| 名称 | 类型 | 值 | 说明 |
| --- | --- | --- | --- |
| `ob.deep` | `Boolean` | 默认为 `false` | 如果为 `true`，`ob.watch(target, expression, callback)` 将会对 `target` 深度监测 |
| `ob.sync` | `Boolean` | 默认为 `false` | 如果为 `true`，`ob.watch(target, expression, callback)` 监测到属性变化时，立即调用回调函数 |
| `ob.default` | `Function` | 只能为 `ob.react`，`ob.watch` 或 `ob.compute`， 默认为 `ob.watch` | 设置 `ob(...)` 实际调用的方法，写起来简洁一些 |

#### 方法

**`ob(...)`**

- 为方法 `ob.default` 的语法糖，`ob.default` 参见属性

**`ob.watch(target, expression, callback)`**

- `target`: 任意对象
- `expression`: `String` 或 `Function`
- `callback`: `Function`
- 返回 `Watcher`，调用 `watcher.teardown()` 可以取消监测

**`ob.compute(target, name, accessor, cache)`**

- `target`: 任意对象
- `name`: `String`
- `accessor`:
  - `Function`: 会作为 `getter`，等同传入 {get: accessor}
  - `Object`: 可以包含：(其中，至少包含 `get` 或 `set`)
    - `get`: `Function`
    - `set`: `Function`
    - `cache`: `Boolean`，可选，默认为 `true`，如果设为 `false`，每次读取计算属性都要重新计算
- `cache`: `Boolean`，可选，默认为 `true`，仅当 `accessor` 为 `Function` 时有效。

**`ob.react(options, target)`**

- `options`: `Object`，要配置的参数集合，可以包含:
  - `data`: 要附加的字段
  - `computed`: 要附加的计算属性
  - `watchers`: 要监测的属性和计算属性
  - `methods`: 要附加的方法，这些方法将会自动绑定 `target`
- `target`: 任意对象，可选，默认为空对象，`options` 的参数将附加到此对象上
- 返回 `target`

## License

[MIT](http://opensource.org/licenses/MIT)

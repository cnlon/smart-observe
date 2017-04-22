[English](https://github.com/cnlon/smart-observe/blob/master/README.md) | 中文

# smart-observe

[![Build Status](https://travis-ci.org/cnlon/smart-observe.svg?branch=master)](https://travis-ci.org/cnlon/smart-observe)
[![npm version](https://badge.fury.io/js/smart-observe.svg)](https://badge.fury.io/js/smart-observe)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

**smart-observe** 来自 [**Vue.js**](https://github.com/vuejs/vue)，是一个小巧、高效，用于监测 javascript 对象、数组、类 变化的库

## 安装

``` bash
npm install --save smart-observe
```

或

```
bower install --save smart-observe
```

## 使用

#### 监测属性 `observe.watch(target, expression, callback)` 或 `observe(target, expression, callback)`

试一试：
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

#### 添加计算属性 `observe.compute(target, name, getter)`

试一试：
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

#### 监测属性并添加计算属性 `observe.react(options)`

试一试：
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

#### 属性

| 名称 | 类型 | 值 | 说明 |
| --- | --- | --- | --- |
| `observe.deep` | `Boolean` | 默认为 `false` | 如果为 `true`，`observe.watch(target, expression, callback)` 将会对 `target` 深度监测 |
| `observe.sync` | `Boolean` | 默认为 `false` | 如果为 `true`，`observe.watch(target, expression, callback)` 监测到属性变化时，立即调用回调函数 |
| `observe.default` | `Function` | 只能为 `observe.react`，`observe.watch` 或 `observe.compute`， 默认为 `observe.watch` | 设置 `observe(...)` 实际调用的方法，写起来简洁一些 |

#### 方法

**`observe(...)`**

- 为方法 `observe.default` 的语法糖，`observe.default` 参见属性

**`observe.watch(target, expression, callback)`**

- `target`: 任意对象
- `expression`: `String` 或 `Function`
- `callback`: `Function`
- 返回 `Watcher`，调用 `watcher.teardown()` 可以取消监测

**`observe.compute(target, name, accessor, cache)`**

- `target`: 任意对象
- `name`: `String`
- `accessor`:
  - `Function`: 会作为 `getter`，等同传入 {get: accessor}
  - `Object`: 可以包含：(其中，至少包含 `get` 或 `set`)
    - `get`: `Function`
    - `set`: `Function`
    - `cache`: `Boolean`，可选，默认为 `true`，如果设为 `false`，每次读取计算属性都要重新计算
- `cache`: `Boolean`，可选，默认为 `true`，仅当 `accessor` 为 `Function` 时有效。

**`observe.react(options, target)`**

- `options`: `Object`，要配置的参数集合，可以包含:
  - `data`: 要附加的字段
  - `computed`: 要附加的计算属性
  - `watchers`: 要监测的属性和计算属性
  - `methods`: 要附加的方法，这些方法将会自动绑定 `target`
- `target`: 任意对象，可选，默认为空对象，`options` 的参数将附加到此对象上
- 返回 `target`

## License

[MIT](http://opensource.org/licenses/MIT)

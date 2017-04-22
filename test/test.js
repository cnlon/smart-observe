const assert = require('chai').assert
const observe = require('../dist/smart-observe.js')

const equal = assert.equal

/* global describe, it */
describe('smart-observe', function () {
  describe('#watch()', function () {
    const target = {a: 1}
    it('target.a\'s old value should equal 1, new value should equal 3, "this" should bound to target', done => {
      observe(target, 'a', function (newValue, oldValue) {
        equal(newValue, 3)
        equal(oldValue, 1)
        equal(newValue, this.a)
        done()
      })
      target.a = 3
    })
  })
  describe('#compute()', function () {
    class Claz {
      constructor () {
        this.a = 1
        observe.compute(this, 'b', () => this.double(this.a))
      }
      double (num) {
        return num * 2
      }
    }
    const target = new Claz()
    target.a = 3
    it('target.b should equal 6', function (done) {
      equal(target.b, 6)
      done()
    })
  })
  describe('#react()', function () {
    it('area should equal 28.274333882308138', function (done) {
      const target = observe.react({
        data: {
          PI: Math.PI,
          radius: 1,
        },
        computed: {
          'area': function () {
            return this.PI * this.square(this.radius)
          },
        },
        watchers: {
          'area': function (newValue, oldValue) {
            equal(newValue, 28.274333882308138)
            done()
          },
        },
        methods: {
          square (num) {
            return num * num
          },
        },
      })
      target.radius = 3
    })
  })
})

var assert = require('chai').assert
var ob = require('../dist/ob.js')

var equal = assert.equal

/* global describe, it */
describe('ob', function () {
  describe('#watch()', function () {
    const target = {a: 1}
    it('target.a\'s old value should equal 1, new value should equal 3, "this" should bound to target', done => {
      ob(target, 'a', function (newValue, oldValue) {
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
        ob.compute(this, 'b', () => this.double(this.a))
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
      const target = ob.react({
        data: {
          PI: Math.PI,
          radii: 1,
        },
        computed: {
          'area': function () {
            return this.PI * this.square(this.radii)
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
      target.radii = 3
    })
  })
})

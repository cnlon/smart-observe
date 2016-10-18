var assert = require('chai').assert
var ob = require('../dist/ob.js')

var equal = assert.equal

/* global describe, it */
describe('ob', function () {
  describe('#watch()', function () {
    const target = {a: 1}
    it('target.a\'s old value should equal 1, new value should equal 2', done => {
      ob.watch(target, 'a', function (newValue, oldValue) {
        equal(newValue, 2)
        equal(oldValue, 1)
        done()
      })
      target.a = 2
    })
  })
  describe('#compute()', function () {
    class Claz {
      constructor () {
        this.a = 1
        ob.compute(this, 'b', function () {
          this.double(this.a)
        })
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
    it('area should equal Math.PI * 9', function (done) {
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
            equal(newValue, Math.PI * 3 * 3)
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

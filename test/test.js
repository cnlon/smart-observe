var assert = require('chai').assert
var ob = require('../dist/ob.js')

var equal = assert.equal

/* global describe, it */
describe('ob', function () {
  var obj = {
    a: 1,
  }
  it('old obj.a should equal 1, new obj.a should equal 3', function (done) {
    ob(obj, 'a', function (newVal, oldVal) {
      equal(newVal, 3)
      equal(oldVal, 1)
      done()
    })
    obj.a = 3
  })

  describe('#compute()', function () {
    var obj = {
      a: 1,
    }
    ob(obj)
    ob.compute('b', function () {
      return this.a * 3
    })
    ob.compute('c', function () {
      return this.a + this.b
    })
    obj.a = 2
    it('b should equal 6', function () {
      equal(obj.b, 6)
    })
    it('c should equal 8', function () {
      equal(obj.c, 8)
    })
  })

  describe('#watch()', function () {
    var obj = {
      a: 1,
      b: 2,
    }
    it('old obj.a should equal 1, new obj.a should equal 3', function (done) {
      ob(obj).watch('a', function (newVal, oldVal) {
        equal(newVal, 3)
        equal(oldVal, 1)
        done()
      })
      obj.a = 3
    })
  })

  describe('#reactive()', function () {
    var obj = {
      a: 1,
    }
    it('old obj.c should equal 13, old obj.c should equal 5', function (done) {
      var option = {
        data: {
          b: 2,
        },
        computed: {
          c: function () {
            return this.square(this.a) + this.square(this.b)
          },
        },
        watchers: {
          'c': function (newVal, oldVal) {
            equal(newVal, 13)
            equal(oldVal, 5)
            done()
          },
        },
        methods: {
          square: function (num) {
            return num * num
          },
        },
      }
      ob(obj).reactive(option)
      obj.a = 3
    })
  })
})

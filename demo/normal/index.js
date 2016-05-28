/* global window setTimeout document ob */

// import ob from 'ob.js'

window.onload = function () {
  var option = {
    data: {
      a: 2,
      c: {
        c: 3,
      },
      e: [1, 2, {v: 2}],
    },
    computed: {
      b () {
        return this.a * 100
      },
      d () {
        return this.c.c * 100
      },
    },
  }

  var d = window.d = {}
  ob(d).config(option)

  function log (msg, prefix) {
    document.getElementById('demo').innerHTML += `<p>${prefix}: ${msg}</p>`
  }
  function test1 () {
    if (d.a === 2 && d.b === 200) {
      return setTimeout(function () {
        if (d.a === 4 && d.b === 400) {
          log('computed yes', 'test1')
        } else {
          log('computed error', 'test1')
        }
      })
    }
  }
  function test2 () {
    ob(d).watch('a', function (newValue, oldValue) {
      log('watch prop yes!  ' + newValue + ',' + oldValue, 'test2')
    })
  }
  function test3 () {
    ob(d).watch('e[0]', function (newValue, oldValue) {
      log('watch array yes!  ' + newValue + ',' + oldValue, 'test3')
    })
  }
  test1()
  test2()
  d.a = 4
  test3()
  d.e.$set(0, 3)
  console.dir(d)
}

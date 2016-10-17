import ob from 'ob.js'

window.onload = function () {
  var option = {
    data: {
      // a: 2,
      c: {
        c: 3,
        d () {},
      },
      e: [1, 2, {v: 2}],
    },
    computed: {
      b () {
        return this.a * 100
      },
      d: {
        get () {
          return this.c.c * 100
        },
      },
    },
    watchers: {
      'a': function (newValue, oldValue) {
        this.innerWatch(newValue, oldValue)
      },
    },
    methods: {
      innerWatch (newValue, oldValue) {
        log('watch prop yes!  ' + newValue + ',' + oldValue, 'inner')
      },
    },
  }

  var d = window.d = {a: 2}
  ob(d, option)

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
    ob.watch(d, 'a', function (newValue, oldValue) {
      log('watch prop yes!   ' + newValue + ',' + oldValue, 'test2')
    })
  }
  function test3 () {
    ob.watch(d, 'e[0]', function (newValue, oldValue) {
      log('watch array yes!   ' + newValue + ',' + oldValue, 'test3')
    })
  }
  test1()
  test2()
  d.a = 4
  test3()
  d.e.$set(0, 3)
  console.dir(d)
}

import ob from 'ob.js'

window.onload = function () {
  const target = window.d = ob.react({
    data: {
      PI: Math.PI,
      radii: 2,
    },
    computed: {
      'area': function () {
        return this.PI * this.square(this.radii)
      },
    },
    watchers: {
      'area': function (newValue, oldValue) {
        console.log(newValue)
      },
    },
    methods: {
      square (num) {
        return num * num
      },
    },
  })
  target.radii = 3
  console.dir(target)
}

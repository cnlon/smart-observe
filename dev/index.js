import observe from 'smart-observe'

window.onload = function () {
  const target = window.d = observe.react({
    data: {
      PI: Math.PI,
      radius: 2,
    },
    computed: {
      'area': function () {
        return this.PI * this.square(this.radius)
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
  target.radius = 3
  console.dir(target)
}

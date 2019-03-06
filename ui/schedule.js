const { list } = require('blessed')

const container = list({
  interactive: false,
  style: { selected: { bg: 'white', fg: 'black' } },
  tags: true,
  scrollable: true,
  scrollbar: {
    style: {
      bg: 'white'
    }
  },
  keys: true,
  vi: true,
  mouse: true,
  border: 'line',
  width: '50%-9',
  left: 19,
  top: 4,
  pad: 1,
  label: 'Tablå'
})

container.on('focus', function () {
  this.interactive = true
})
container.on('blur', function () {
  this.interactive = false
})

module.exports = container

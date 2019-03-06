const { list, message } = require('blessed')

const container = list({
  interactive: false,
  style: { selected: { bg: 'white', fg: 'black' } },
  tags: true,
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
  right: 0,
  top: 4,
  pad: 1,
  label: 'Låtlista för programmet'
})

container.on('focus', function () {
  this.interactive = true
})
container.on('blur', function () {
  this.interactive = false
})

const infoDialog = message({
  width: 60,
  height: 8,
  border: 'line',
  tags: true,
  hidden: true,
  shadow: true,
  top: 'center',
  left: 'center',
  label: 'Låtinformation'
})

module.exports = { container, infoDialog }

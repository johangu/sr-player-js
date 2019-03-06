const { list } = require('blessed')
const { screen } = require('./screen')

const container = list({
  interactive: false,
  style: { selected: { bg: 'white', fg: 'black' } },
  top: 4,
  width: 20,
  scrollable: true,
  border: 'line',
  keys: true,
  vi: true,
  mouse: true,
  label: 'Kanaler'
})
container.on('focus', function () {
  this.interactive = true
})
container.on('blur', function () {
  this.interactive = false
})

const filter = list({
  style: { selected: { bg: 'white', fg: 'black' } },
  keys: true,
  vi: true,
  mouse: true,
  top: 'center',
  left: 'center',
  width: 25,
  hidden: true,
  height: 8,
  shadow: true,
  border: 'line'
})

function populate (items) {
  items.map(i => container.pushItem(i))
  screen.render()
}

module.exports = {
  container,
  filter,
  populate
}

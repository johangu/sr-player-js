const { screen } = require('blessed')

module.exports = screen({
  title: 'Sveriges Radio TUI player',
  smartCSR: true,
  dockBorders: true
})

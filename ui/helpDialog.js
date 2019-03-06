const { message } = require('blessed')

module.exports = message({
  hidden: true,
  shadow: true,
  top: 'center',
  left: 'center',
  width: 40,
  height: 12,
  style: {
    bg: 'blue',
    fg: 'white'
  },
  border: {
    bold: true,
    type: 'line',
    bg: 'blue',
    fg: 'white'
  },
  label: 'Hjälp',
  tags: true,
  content: `{bold}h{/} - Visa denna dialog
{bold}q{/} - Avsluta
{bold}space{/} - Pause/Play
{bold}/{/} - Filtrera kanallistan

Tryck valfri tangent för att stänga denna dialog`
})

const { box, text, progressbar } = require('blessed')
const { screen } = require('./screen')

const ICONS = {
  play: '\uf04b',
  stop: '\uf04d',
  pause: '\uf04c'
}

const ui = {
  player: {
    icon: ICONS.stop,
    style: {
      fg: 'red'
    }
  }
}

const container = box({
  width: '100%'
})

const playerIcon = text({
  parent: container,
  left: 0,
  top: 0,
  content: ui.player.icon,
  style: ui.player.style
})

const currentlyPlaying = text({
  tags: true,
  parent: container,
  left: 2,
  top: 0,
  content: 'Ingen ljudström spelas',
  style: ui.player.style
})

const progressBar = progressbar({
  parent: container,
  orientation: 'horizontal',
  top: 1,
  height: 3,
  style: {
    fg: 'blue',
    bar: { fg: 'blue' }
  },
  ch: '\uf101',
  border: 'line',
  filled: 0
})

function togglePlay (playing) {
  const icon = playing ? ICONS.play : ICONS.pause
  setIcon(icon)
}

function setProgramInfo (name, title, subtitle) {
  currentlyPlaying.setContent(
    `{bold}${name}{/bold} - ${title} ${subtitle || ''}`
  )
  setIcon(ICONS.play)
  screen.render()
}

function setProgress (value) {
  progressBar.setProgress(value)
  progressBar.setLabel({ side: 'right', text: `${parseInt(value)}%` })
  screen.render()
}

function setIcon (icon) {
  switch (icon) {
    case ICONS.play:
      ui.player.style.fg = 'green'
      break
    case ICONS.pause:
      ui.player.style.fg = 'yellow'
      break
  }

  playerIcon.setContent(icon)
  screen.render()
}

module.exports = {
  ICONS,
  container,
  setProgramInfo,
  setProgress,
  togglePlay
}

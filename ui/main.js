const screen = require('./screen')
const channelList = require('./channelList')
const radioPlayer = require('./player')
const playlist = require('./playlist')
const schedule = require('./schedule')
const helpDialog = require('./helpDialog')

screen.append(radioPlayer.container)
screen.append(channelList.container)
screen.append(schedule)
screen.append(playlist.container)

// Adding dialogs last so we don't need to call setFront() when displaying them
screen.append(helpDialog)
screen.append(channelList.filter)
screen.append(playlist.infoDialog)

channelList.container.focus()
screen.render()

module.exports = {
  channelList,
  helpDialog,
  playlist,
  radioPlayer,
  schedule,
  screen
}

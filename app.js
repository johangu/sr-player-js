const Player = require('./audioPlayer')
const ui = require('./ui')

const API = require('sverigesradio-api')

class SRPlayer {
  constructor () {
    this.channelTypes = ['Alla kanaler']
    this.allChannels = []
    this.player = new Player()
    this._initKeyBindings()
    this._initListeners()
    this._fetchChannels()
  }

  selectChannel (name) {
    const [{ url, id }] = this.allChannels.filter(c => c.name === name)
    this.stop()
    this.play(url)
    this._fetchChannelSchedule(id)
    this._fetchProgramInfo(id)
  }

  play (url) {
    return this.player.play(url)
  }

  togglePlay () {
    return (
      this.player.togglePlay() &&
      ui.radioPlayer.togglePlay(this.player.isPlaying())
    )
  }

  stop () {
    return this.player.stop()
  }

  quit () {
    this.player.stop()
    this._cleanupTimers()
    ui.screen.destroy()
  }

  filterChannelList (channelType) {
    const filter =
      channelType && channelType !== 'Alla kanaler'
        ? x => x.channeltype === channelType
        : _ => true

    ui.channelList.container.clearItems()
    ui.channelList.populate(this.allChannels.filter(filter).map(c => c.name))
  }

  async _fetchChannels () {
    try {
      const { channels } = await API.channels({ pagination: false })
      ui.channelList.populate(
        channels.map(({ id, name, liveaudio: { url }, channeltype }) => {
          this.allChannels.push({ name, id, url, channeltype })
          if (!this.channelTypes.includes(channeltype)) {
            this.channelTypes.push(channeltype)
          }
          return name
        })
      )
    } catch (e) {
      console.error(e)
    }
  }

  populatePlaylist (songs) {
    this._playlist = songs
    ui.playlist.container.setItems(
      songs.map(s => {
        const startTime = this._cleanStartTime(s)
        const stopTime = this._cleanStopTime(s)
        const playing = stopTime > new Date()

        // If a song is playing, refresh the playlist when it's done
        // otherwise, fetch the playlist again in a minute to see if
        // a song has started playing
        this._cleanupRefreshTimers()
        this._refreshPlaylistTimer = playing
          ? setTimeout(
            this.populatePlaylist.bind(this),
            new Date() - stopTime,
            songs
          )
          : setTimeout(
            this._fetchEpisodePlaylist.bind(this),
            60000,
            this._currentEpisodeId
          )

        const icon = playing ? '\uf001' : ''
        const time = this._formatTime(startTime)
        return `${time}: ${icon} ${s.artist} - ${s.title} ${icon}`
      })
    )
  }

  async _fetchEpisodePlaylist (id) {
    try {
      const { song } = await API.playlistForEpisode({ id })
      this.populatePlaylist(song)
    } catch (e) {
      ui.playlist.container.clearItems()
    }
  }

  async _fetchChannelSchedule (channelid) {
    this._cleanupScheduleTimers()
    this.scheduleTimers = []

    try {
      const { schedule: programs } = await API.schedule({ channelid })
      ui.schedule.setItems(
        programs
          .filter(p => this._cleanStartTime(p) > new Date())
          .map(e => {
            const startTime = this._cleanStartTime(e)
            const time = this._formatTime(startTime)

            this.scheduleTimers.push(
              setInterval(_ => ui.schedule.shiftItem(), startTime - new Date())
            )

            return `${time}: ${e.title}`
          })
          .sort()
      )
    } catch (e) {
      ui.schedule.clearItems()
    }
  }

  _fetchProgramInfo (channelid) {
    API.schedule({
      rightNow: true,
      channelid
    }).then(({ channel: { name, currentscheduledepisode } }) => {
      const startTime = this._cleanStartTime(currentscheduledepisode)
      const endTime = this._cleanEndTime(currentscheduledepisode)
      const episodeLength = endTime - startTime

      this._cleanupProgramTimers()
      this.updateProgressBarInterval = setInterval(_ => {
        const timePlayed = new Date() - startTime
        ui.radioPlayer.setProgress((timePlayed / episodeLength) * 100)
      }, 1000)

      this.updateProgramInfoTimer = setTimeout(
        this._fetchProgramInfo.bind(this),
        endTime - new Date(),
        channelid
      )

      ui.radioPlayer.setProgramInfo(
        name,
        currentscheduledepisode.title,
        currentscheduledepisode.subtitle
      )

      this._currentEpisodeId = currentscheduledepisode.episodeid
      this._fetchEpisodePlaylist(this._currentEpisodeId)
    })
  }

  _cleanupScheduleTimers () {
    if (this.scheduleTimers) this.scheduleTimers.map(t => clearTimeout(t))
  }

  _cleanupProgramTimers () {
    clearInterval(this.updateProgressBarInterval)
    clearTimeout(this.updateProgramInfoTimer)
  }

  _cleanupRefreshTimers () {
    clearTimeout(this._refreshPlaylistTimer)
  }

  _cleanupTimers () {
    this._cleanupScheduleTimers()
    this._cleanupProgramTimers()
    this._cleanupRefreshTimers()
  }

  _cleanTimestamp (date) {
    return date.replace(/\D/g, '')
  }

  _cleanStartTime ({ starttimeutc }) {
    return this._cleanTimestamp(starttimeutc)
  }

  _cleanEndTime ({ endtimeutc }) {
    return this._cleanTimestamp(endtimeutc)
  }

  _cleanStopTime ({ stoptimeutc }) {
    return this._cleanTimestamp(stoptimeutc)
  }

  _formatTime (timestamp) {
    return new Date(parseInt(timestamp)).toLocaleTimeString('se-SE')
  }

  _initListeners () {
    ui.channelList.container.on('select', ({ content: name }) =>
      this.selectChannel(name)
    )

    ui.playlist.container.on('select', async ({ content }) => {
      const i = ui.playlist.container.getItemIndex(content)
      const song = this._playlist[i]
      ui.playlist.infoDialog.display(
        `Artist: ${song.artist || '-'}
Titel: ${song.title || '-'}
Album: ${song.album || '-'}
Låtskrivare: ${song.composer.replace(/\//g, ', ') || '-'}
Producent: ${song.producer || '-'}
Skivbolag: ${song.recordlabel || '-'}`,
        0
      )
    })
  }

  _initKeyBindings () {
    ui.screen.key('space', this.togglePlay.bind(this))
    ui.screen.key(['C-c', 'q'], this.quit.bind(this))

    ui.screen.key('/', _ => {
      ui.channelList.filter.setItems(this.channelTypes)
      ui.channelList.filter.pick((_, filter) => this.filterChannelList(filter))
    })

    ui.screen.key('h', _ =>
      ui.helpDialog.display(ui.helpDialog.getContent(), 0)
    )

    ui.screen.key('S-tab', ui.screen.focusNext)
    ui.screen.key('tab', ui.screen.focusPrevious)
  }
}

module.exports = new SRPlayer()

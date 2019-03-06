const { get } = require('request')
const Speaker = require('speaker')
const { Decoder } = require('nampg123')
const DEFAULT_OPTIONS = {
  bitDepth: 16,
  sampleRate: 44100
}

class Player {
  constructor (options) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  play (url) {
    if (!url) return false
    if (this.isPlaying()) this.stop()

    this._playing = true
    this._lastUrl = url
    this._decoder = new Decoder()
    this._speaker = new Speaker(this.options)
    this._currentStream = get(url).on('response', res =>
      res.pipe(this._decoder).once('format', _ => {
        this._decoder.pipe(this._speaker)
      })
    )
    return true
  }

  stop () {
    if (!this.isPlaying()) return false
    this._playing = false
    this._currentStream.end()
    this._speaker.end()
    return true
  }

  resume () {
    return this.play(this._lastUrl)
  }

  togglePlay () {
    return this.isPlaying() ? this.stop() : this.resume()
  }

  isPlaying () {
    return this._playing
  }
}

module.exports = Player

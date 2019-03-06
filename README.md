# SR Player
A TUI for listening to the Swedish state radio [*Sveriges Radio*](https://www.sverigesradio.se) built with [nodejs](https://nodejs.org/en/) and [blessed](https://github.com/chjj/blessed) using their [official API](https://sverigesradio.se/api/documentation/v2/index.html)  
Please note that the UI is in Swedish

## Install
The app is hosted on npm, and can easily be installed with `npm i -g sr-player`

### Dependencies
#### libmpg123
This application depends on locally installed `libmpg123` for decoding the mp3-streams  
##### MacOS
`brew install mpg123`  
##### Linux
Use your package manager to install `mpg123` or `libmpg123` (e.g. `https://github.com/chjj/blessed`)

## Usage
`q` - quit the application  
`h` - show the help screen  
`/` - filter the channel list according to channel type  
`space` - play/stop the stream  
`j/↑` - Previous item in the active list  
`k/↓` - Next item in the active list  
`enter` - Select item in channel list
`tab` - Move focus to the next list
`S-tab` - Move focus to the previous list

### Playlist
Select an item in the playlist to get information about the song

### Schedule
No activity implemented on selection, yet

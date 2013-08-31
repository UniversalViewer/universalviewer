# Wellcome Player

Navigate sequences of images in a zoomable, extensible interface.

## Stable Builds

See the [GitHub releases page](https://github.com/wellcomelibrary/player/releases).

## Development

If you want to use the Wellcome Player in your own projects, you can find the latest stable build, API documentation, and example code at http://wellcomeplayer.github.io. If you want to modify the Wellcome Player and/or contribute to its development, read on.

### First Time Setup

All command-line operations for building the Wellcome Player are scripted using [Grunt](http://gruntjs.com/) which is based on [Node.js](http://nodejs.org/). We are using Node for this project because it provides a powerful cross-platform collection of tools with minimal setup overhead. To get set up:

1. Install [Node.js](http://nodejs.org), if you haven't already
1. Install the Grunt command line interface (if you haven't already); on the command line, run `$ npm install -g grunt-cli`
1. Clone the 'player' repository
1. On the command line, go in to the 'player' folder
1. Run `$ npm install`

### Debug Builds

To build the debug version of the player, just run (on the command line, in the 'player' folder):

`$ grunt`

This will compile the .less files into .css and .ts (TypeScript) files into .js with sourcemaps to aid in debugging.

### Release Builds

To build the release version of the player, just run (on the command line, in the 'player' folder):

`$ grunt build`

The built files appear in the 'build' folder.

If you want to build tar and zip files for distribution (they will also appear in the 'build' folder), use:

`$ grunt package`

Note that the 'build' folder is masked with .gitignore; it's just for your local use, and won't be checked in to the repository.

### Viewing on localhost

To see the debug version of the player (located in the '/src' folder), run `$ grunt connect:debug` and browse to 'http://localhost:3000'

To see the release version of the player (located in the '/build' folder), run `$ grunt connect:release` and browse to 'http://localhost:3001'

## License

The Wellcome Player is released under the MIT license. For details, see the file LICENSE.txt.

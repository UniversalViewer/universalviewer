# Universal Viewer

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/UniversalViewer/universalviewer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[Demo](http://universalviewer.azurewebsites.net/)

[Google group](https://groups.google.com/forum/#!forum/universalviewer)

## Contributors

![Wellcome Library](https://raw.githubusercontent.com/UniversalViewer/universalviewer/master/assets/wellcome_logo.png "Wellcome Library")
![British Library](https://raw.githubusercontent.com/UniversalViewer/universalviewer/master/assets/bl_logo.png "British Library")
![National Library of Wales](https://raw.githubusercontent.com/UniversalViewer/universalviewer/master/assets/nlw_logo.png "National Library of Wales")
![Villanova University, Falvey Memorial Library](https://raw.githubusercontent.com/UniversalViewer/universalviewer/master/assets/vufalvey_logo.png "Villanova University, Falvey Memorial Library")

## Stable Builds

See the [GitHub releases page](https://github.com/UniversalViewer/UniversalViewer/releases).

## Development

Please see the [wiki](https://github.com/UniversalViewer/UniversalViewer/wiki) for instructions on how to customise the viewer for your own projects.

### First Time Setup

All command-line operations for building the UV are scripted using [Grunt](http://gruntjs.com/) which is based on [Node.js](http://nodejs.org/). To get set up:

1. Install [Node.js](http://nodejs.org), if you haven't already

1. Install the grunt command line interface (if you haven't already); on the command line, run:

	    npm install -g grunt-cli

1. Install bower (if you haven't already)

        npm install -g bower

1. Clone the `universalviewer` repository and sub modules:

	    git clone git@github.com:UniversalViewer/universalviewer.git --recursive

1. On the command line, go in to the `universalviewer` folder

1. Run

        npm install

1. Then run

        bower install


### Debug Builds

To build the debug version of the viewer, just run (on the command line, in the `universalviewer` folder):

	grunt

This will compile the [.less](http://lesscss.org) files into .css and [.ts](http://typescriptlang.org) files into .js with source maps to aid in debugging.

### Release Builds

To build the release version of the viewer, just run (on the command line, in the `universalviewer` folder):

	grunt build

The built files appear in the `build` folder and are copied to `examples/uv-[build]`.

If you want to create a zip file for distribution (this will appear in the `dist` folder), use:

	grunt dist

Note that the `build` folder is masked with `.gitignore`; it's just for your local use, and won't be checked in to the repository.

### Examples

To view the examples run:

    grunt serve

## License

The Universal Viewer is released under the [MIT license](https://github.com/UniversalViewer/universalviewer/blob/master/LICENSE.txt).
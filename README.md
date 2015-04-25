# Universal Viewer

[Demo](http://universalviewer.azurewebsites.net/)

[National Library of Wales Demo](http://nlw.azurewebsites.net/)

[Google group](https://groups.google.com/forum/#!forum/universalviewer)

## Contributors

![Wellcome Library](https://raw.githubusercontent.com/UniversalViewer/universalviewer/master/assets/wellcome_logo.png "Wellcome Library")
![British Library](https://raw.githubusercontent.com/UniversalViewer/universalviewer/master/assets/bl_logo.png "British Library")
![National Library of Wales](https://raw.githubusercontent.com/UniversalViewer/universalviewer/master/assets/nlw_logo.png "National Library of Wales")

## Stable Builds

See the [GitHub releases page](https://github.com/UniversalViewer/UniversalViewer/releases).

## Development

Please see the [wiki](https://github.com/UniversalViewer/UniversalViewer/wiki) for instructions on how to customise the viewer for your own projects.

### First Time Setup

All command-line operations for building the Universal Viewer are scripted using [Grunt](http://gruntjs.com/) which is based on [Node.js](http://nodejs.org/). We are using Node for this project because it provides a powerful cross-platform collection of tools with minimal setup overhead. To get set up:

1. Install [Node.js](http://nodejs.org), if you haven't already
1. Install the Grunt command line interface (if you haven't already); on the command line, run:

	`npm install -g grunt-cli`
1. Clone the 'universalviewer' repository and submodules:

	`git clone git@github.com:UniversalViewer/universalviewer.git --recursive`
1. On the command line, go in to the 'universalviewer' folder
1. Run

	`npm install`

### Debug Builds

To build the debug version of the viewer, just run (on the command line, in the 'UniversalViewer' folder):

	grunt

This will compile the [.less](http://lesscss.org) files into .css and [.ts](http://typescriptlang.org) files into .js with sourcemaps to aid in debugging.

### Release Builds

To build the release version of the viewer, just run (on the command line, in the 'UniversalViewer' folder):

	grunt build

The built files appear in the 'build' folder.

If you want to build tar and zip files for distribution (they will also appear in the 'build' folder), use:

	grunt package

Note that the 'build' folder is masked with .gitignore; it's just for your local use, and won't be checked in to the repository.

### Examples

To view the examples run:

    grunt serve

## License

The Universal Viewer is released under the MIT license. For details, see the file LICENSE.txt.
# Universal Viewer

[![Build Status](https://travis-ci.org/UniversalViewer/universalviewer.svg?branch=master)](https://travis-ci.org/UniversalViewer/universalviewer) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/UniversalViewer/universalviewer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[Demo](http://universalviewer.azurewebsites.net/)

[Google group](https://groups.google.com/forum/#!forum/universalviewer)

[Twitter](https://twitter.com/universalviewer)

## Contributors

![Wellcome Library](https://raw.githubusercontent.com/UniversalViewer/assets/master/wellcome_logo.png "Wellcome Library")
![British Library](https://raw.githubusercontent.com/UniversalViewer/assets/master/bl_logo.png "British Library")
![National Library of Wales](https://raw.githubusercontent.com/UniversalViewer/assets/master/nlw_logo.png "National Library of Wales")
![Villanova University, Falvey Memorial Library](https://raw.githubusercontent.com/UniversalViewer/assets/master/vufalvey_logo.png "Villanova University, Falvey Memorial Library")

## About

The Universal Viewer is an [open source](https://github.com/UniversalViewer/universalviewer/blob/master/LICENSE.txt) project to enable cultural heritage institutions to present their digital artifacts in an [IIIF-compliant](http://iiif.io/) and highly customisable user interface. 

Features:

- [OpenSeadragon](https://openseadragon.github.io/) image zooming using the [IIIF image API](http://iiif.io/api/image/2.0/).
- YouTube-style embedding with deep links to specific pages/zoom regions.
- [Themable](https://stackedit.io/viewer#!provider=gist&gistId=5411c4576c2ec7387bba&filename=uv-theming-tutorial.md), fork the [UV theme](https://github.com/UniversalViewer/uv-en-GB-theme) on github to create your own.
- Highly [configurable](https://github.com/UniversalViewer/universalviewer/wiki/Configuration) and [extensible](http://universalviewer.gitbooks.io/custom-extensions/content/).
- Supports "IxIF" out of the box, allowing [audio](http://universalviewer.azurewebsites.net/?manifest=http://wellcomelibrary.org/iiif/b17307922/manifest), [video](http://universalviewer.azurewebsites.net/?manifest=http://wellcomelibrary.org/iiif/b16659090/manifest), and [pdf](http://universalviewer.azurewebsites.net/?manifest=http://wellcomelibrary.org/iiif/b17502792/manifest) viewing experiences.
- Supports search and autocomplete service integration with overlayed search results.
- Internationalised UI using [transifex.com](https://www.transifex.com/) (currently supports English and Welsh. Volunteers for more translations gratefully accepted!)

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
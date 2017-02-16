# Universal Viewer

[![Build Status](https://travis-ci.org/UniversalViewer/universalviewer.svg?branch=master)](https://travis-ci.org/UniversalViewer/universalviewer) 
&nbsp;&nbsp;
<a href="https://universalviewerinvite.herokuapp.com"><img src="https://worldvectorlogo.com/logos/slack.svg" width="60" /></a>

    npm install universalviewer --save

[Examples](http://universalviewer.io/examples/)

[Google group](https://groups.google.com/forum/#!forum/universalviewer)

[Twitter](https://twitter.com/universalviewer)

## Contributors

![Contributors](https://raw.githubusercontent.com/UniversalViewer/assets/master/logos.jpg "Contributors")

## Features:

- **Zoomable**
  <p><a href="https://openseadragon.github.io/">OpenSeadragon</a> image zooming using the <a href="http://iiif.io/api/image/2.0/">IIIF image API</a></p>
- **Embeddable**
  <p>YouTube-style embedding with deep links to specific pages/zoom regions.</p>
- **Themable**
  <p>Fork the <a href="https://github.com/UniversalViewer/uv-en-GB-theme">UV theme</a> on github to create your own.</p>
- **Configurable**
  <p>The UV has its own visual configuration editor allowing all settings to be customised.</p>
- **Extensible**
  <p>Supports "IxIF" out of the box, allowing <a href="http://universalviewer.io/examples/?manifest=http://files.universalviewer.io/manifests/nelis/ecorche.json">3D</a>, <a href="http://universalviewer.io/examples/?manifest=http://wellcomelibrary.org/iiif/b17307922/manifest">audio</a>, <a href="http://universalviewer.io/examples/?manifest=http://wellcomelibrary.org/iiif/b16659090/manifest">video</a>, and <a href="http://universalviewer.io/examples/?manifest=http://wellcomelibrary.org/iiif/b17502792/manifest">pdf</a> viewing experiences.</p>

[More about the Universal Viewer](https://github.com/UniversalViewer/universalviewer/wiki/About)

## Stable Builds

See the [GitHub releases page](https://github.com/UniversalViewer/UniversalViewer/releases).

## Development

The most up-to-date code can usually be found on the `dev` branch.
Please see the [wiki](https://github.com/UniversalViewer/UniversalViewer/wiki) for instructions on how to customise the viewer for your own projects.

### First Time Setup

All command-line operations for building the UV are scripted using [Grunt](http://gruntjs.com/) which is based on [Node.js](http://nodejs.org/). To get set up:

1. Install [Node.js](http://nodejs.org), if you haven't already

1. Install the grunt command line interface (if you haven't already); on the command line, run:

	    npm install -g grunt-cli

1. Install bower (if you haven't already)

        npm install -g bower

1. Clone the `universalviewer` repository and sub modules:

	    git clone https://github.com/UniversalViewer/universalviewer.git --recursive

1. On the command line, go in to the `universalviewer` folder

1. Run

        npm install
        bower install
        grunt sync

### Debug Builds

To build the debug version of the viewer, just run (on the command line, in the `universalviewer` folder):

	grunt

This will compile the [.less](http://lesscss.org) files into .css and [.ts](http://typescriptlang.org) files into .js with source maps to aid in debugging.

### Distribution Builds

To build the distribution version of the UV, just run (on the command line, in the `universalviewer` folder):

	grunt build

A versioned `uv-major.minor.patch` folder along with compressed .zip and .tar files will appear in the `/dist` folder. Use these in your website, or alternatively use:
 
    npm install universalviewer --save
    
which will download the distribution folder to `node_modules`.

### Examples

To view the examples run:

    grunt
    grunt examples

## License

The Universal Viewer is released under the [MIT license](https://github.com/UniversalViewer/universalviewer/blob/master/LICENSE.txt).

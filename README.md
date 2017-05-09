# Universal Viewer

[![Backers on Open Collective](https://opencollective.com/universalviewer/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/universalviewer/sponsors/badge.svg)](#sponsors)
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


## Backers

Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/universalviewer#backer)]

<a href="https://opencollective.com/universalviewer/backer/0/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/1/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/2/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/3/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/4/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/5/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/6/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/7/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/8/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/9/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/10/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/11/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/12/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/13/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/14/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/15/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/16/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/17/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/18/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/19/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/20/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/21/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/22/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/23/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/24/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/25/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/26/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/27/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/28/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/backer/29/website" target="_blank"><img src="https://opencollective.com/universalviewer/backer/29/avatar.svg"></a>


## Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/universalviewer#sponsor)]

<a href="https://opencollective.com/universalviewer/sponsor/0/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/1/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/2/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/3/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/4/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/5/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/6/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/7/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/8/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/9/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/10/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/11/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/12/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/13/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/14/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/15/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/16/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/17/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/18/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/19/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/20/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/21/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/22/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/23/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/24/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/25/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/26/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/27/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/28/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/universalviewer/sponsor/29/website" target="_blank"><img src="https://opencollective.com/universalviewer/sponsor/29/avatar.svg"></a>


## License

The Universal Viewer is released under the [MIT license](https://github.com/UniversalViewer/universalviewer/blob/master/LICENSE.txt).


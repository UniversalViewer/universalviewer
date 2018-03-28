
<p align="center">
    <img src="https://raw.githubusercontent.com/UniversalViewer/assets/master/logo.jpg">
    <h1 align="center">Universal Viewer</h1>
</p>

<p align="center">
    <a href="#backers"><img src="https://camo.githubusercontent.com/8f205f0459eaafbbcf78554ae3182da599b178b9/68747470733a2f2f6f70656e636f6c6c6563746976652e636f6d2f756e6976657273616c7669657765722f6261636b6572732f62616467652e737667" alt="Backers on Open Collective" data-canonical-src="https://opencollective.com/universalviewer/backers/badge.svg" style="max-width:100%;"></a>
    <a href="#sponsors"><img src="https://camo.githubusercontent.com/db8439fd8526d52fbc36437f988d0d8d8dd6913a/68747470733a2f2f6f70656e636f6c6c6563746976652e636f6d2f756e6976657273616c7669657765722f73706f6e736f72732f62616467652e737667" alt="Sponsors on Open Collective" data-canonical-src="https://opencollective.com/universalviewer/sponsors/badge.svg" style="max-width:100%;"></a>
    <a href="https://travis-ci.org/UniversalViewer/universalviewer" rel="nofollow"><img src="https://camo.githubusercontent.com/f8b81af36c9c573b23dff74a97943ae97f7c0aa9/68747470733a2f2f7472617669732d63692e6f72672f556e6976657273616c5669657765722f756e6976657273616c7669657765722e7376673f6272616e63683d6d6173746572" alt="Build Status" data-canonical-src="https://travis-ci.org/UniversalViewer/universalviewer.svg?branch=master" style="max-width:100%;"></a>
    <a href="https://app.fossa.io/projects/git%2Bgithub.com%2FUniversalViewer%2Funiversalviewer?ref=badge_shield" rel="nofollow"><img src="https://camo.githubusercontent.com/eedb4c09b3beed6d26cfef59a2ee31ce8e1c80d7/68747470733a2f2f6170702e666f7373612e696f2f6170692f70726f6a656374732f6769742532426769746875622e636f6d253246556e6976657273616c566965776572253246756e6976657273616c7669657765722e7376673f747970653d736869656c64" alt="FOSSA Status" data-canonical-src="https://app.fossa.io/api/projects/git%2Bgithub.com%2FUniversalViewer%2Funiversalviewer.svg?type=shield" style="max-width:100%;"></a>
    <a href="https://github.com/UniversalViewer/universalviewer/blob/master/LICENSE.txt"><img src="https://camo.githubusercontent.com/e80e20b31b4af7da8580f68d415779d250eee229/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f74687265652e737667" alt="License" data-canonical-src="https://img.shields.io/npm/l/universalviewer.svg" style="max-width:100%;"></a>
</p>

<!--
[![Backers on Open Collective](https://opencollective.com/universalviewer/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/universalviewer/sponsors/badge.svg)](#sponsors)
[![Build Status](https://travis-ci.org/UniversalViewer/universalviewer.svg?branch=master)](https://travis-ci.org/UniversalViewer/universalviewer) 
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FUniversalViewer%2Funiversalviewer.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FUniversalViewer%2Funiversalviewer?ref=badge_shield)
&nbsp;&nbsp;
<a href="https://universalviewerinvite.herokuapp.com"><img src="https://worldvectorlogo.com/logos/slack.svg" width="60" /></a>
-->

<p align="center">
    <a href="http://universalviewer.io/examples/">examples</a>&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://groups.google.com/forum/#!forum/universalviewer">google group</a>&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://twitter.com/universalviewer">twitter</a>&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://universalviewerinvite.herokuapp.com" rel="nofollow">#slack</a>
</p>

<br>


    npm install universalviewer@beta --save


## Contributors

![Contributors](https://raw.githubusercontent.com/UniversalViewer/assets/master/contributors.jpg "Contributors")

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
  <p>Supports IIIF Presentation API v3 (in development), allowing <a href="http://universalviewer.io/examples/?manifest=http://files.universalviewer.io/manifests/nelis/ecorche.json">3D</a>, <a href="http://universalviewer.io/examples/?manifest=http://wellcomelibrary.org/iiif/b17307922/manifest">audio</a>, <a href="http://universalviewer.io/examples/?manifest=http://wellcomelibrary.org/iiif/b16659090/manifest">video</a>, and <a href="http://universalviewer.io/examples/?manifest=http://wellcomelibrary.org/iiif/b17502792/manifest">pdf</a> viewing experiences.</p>

[More about the Universal Viewer](https://github.com/UniversalViewer/universalviewer/wiki/About)

## Stable Builds

See the [GitHub releases page](https://github.com/UniversalViewer/UniversalViewer/releases).

## Getting Started

For a "hello world" getting started example see [uv-hello-world](https://github.com/UniversalViewer/uv-hello-world).

For an example of how to use the Universal Viewer in a website starter project that uses [biiif](https://github.com/edsilv/biiif) to generate your IIIF data, see [uv-app-starter](https://github.com/UniversalViewer/uv-app-starter).

## Building the Universal Viewer

All command-line operations for building the UV are scripted using [Grunt](http://gruntjs.com/) which is based on [Node.js](http://nodejs.org/). To get set up:

1. Install [Node.js](http://nodejs.org), if you haven't already

1. Install the grunt command line interface:

    `npm install -g grunt-cli`

<!--
1. Install [Sorcery](https://github.com/Rich-Harris/sorcery):

    npm install -g sorcery
-->
1. Clone the `universalviewer` repository and `examples` sub module:

    `git clone https://github.com/UniversalViewer/universalviewer.git --recursive`

1. On the command line, go in to the `universalviewer` folder

1. Run

    `npm install`

> If switching between branches, ensure that you check out the correct branch in the `examples` sub-repository too. By default this should be `gh-pages`.

## Debug Builds

To build the debug version of the viewer, just run (on the command line, in the `universalviewer` folder):

    grunt build

This will compile the [.less](http://lesscss.org) files into .css and [.ts](http://typescriptlang.org) files into .js.

## Distribution Builds

To build the distribution version of the UV, just run (on the command line, in the `universalviewer` folder):

    grunt build --dist

## Examples

To view the examples run:

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


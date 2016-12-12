# Universal Viewer (with OCR module)

This is a fork from Universal Viewer that implements a new OCR module.

## What is the OCR module?

The OCR module render a new right panel where you can find the text extracted from the viewed image, retrieved from a web-annotation service.

## Functionality

OCR module allows to show, in a new right panel, the text extracted from the viewed image by an OCR Software (e.g. Tesseract). 
Moreover you can highlight the text within the OCR panel finding it on the image. 
The highlighted text is rendered like searching with the footer panel search.

## Examples

Try a live demo here : http://uvdemo.4science.it

## How to enable the OCR module

For using the OCR module you need to add a new service in your manifest :

    "service": [
                ...
                {
                  "@context" : "http://www.w3.org/ns/anno.jsonld",
                  "@id"      : "{ocrservice-id}",
                  "profile"  : "http://4science.it/api/ocr/0/annotationCollection",
                  "label"    : "OCR"
                }
              ]

See http://uvdemo.4science.it/manifest/hamlet for an example manifest.

## How does it works?

The annotation server respond with an annotation collection described as below : 

    {
        "@context": [
            "http://www.w3.org/ns/anno.jsonld"
        ],
        "@id": "{ocr-service-id}?q={canvas-id}",
        "type": "AnnotationCollection",
        "label": "Page OCR",
        "total": 184,
        "first": {
            "id": "{ocr-service-id}/annotationPage?q={canvas-id}#ltr",
            "type": "AnnotationPage",
            "startIndex": 0,
            "items": [
                {
                    "id": "{item-id}#word_1_1",
                    "type": "Annotation",
                    "body": {
                        "type": "TextualBody",
                        "value": "64",
                        "format": "text",
                        "textDirection": "ltr"
                    },
                    "target": [
                        "{canvas-id}#xywh=107,83,16,13",
                        "{canvas-id}#area=block_1_1",
                        "{canvas-id}#paragraph=par_1_1",
                        "{canvas-id}#line=line_1_1"
                    ]
                }
            ]
        }
    }

The server response is parsed by the new module and showed as a text rapresentation of the viewed image.

[Next steps]

- Enable editing of each single annotation (eg. single word recognized by the OCR software) from the user interface;
- Create a new annotation by drawing it over the image. 

# Universal Viewer 

[![Build Status](https://travis-ci.org/UniversalViewer/universalviewer.svg?branch=master)](https://travis-ci.org/UniversalViewer/universalviewer) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/UniversalViewer/universalviewer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)



    npm install universalviewer

or

    bower install uv

[Examples](http://universalviewer.io/examples/)

[Google group](https://groups.google.com/forum/#!forum/universalviewer)

[Twitter](https://twitter.com/universalviewer)

## Contributors

![Wellcome Library](https://raw.githubusercontent.com/UniversalViewer/assets/master/wellcome_logo.png "Wellcome Library")
![British Library](https://raw.githubusercontent.com/UniversalViewer/assets/master/bl_logo.png "British Library")
![National Library of Wales](https://raw.githubusercontent.com/UniversalViewer/assets/master/nlw_logo.png "National Library of Wales")
![Villanova University, Falvey Memorial Library](https://raw.githubusercontent.com/UniversalViewer/assets/master/vufalvey_logo.png "Villanova University, Falvey Memorial Library")
![Riksarkivet](https://raw.githubusercontent.com/Riksarkivet/assets/master/logo-en.png "Riksarkivet, The Swedish National Archives")

## About

The Universal Viewer is an [open source](https://github.com/UniversalViewer/universalviewer/blob/master/LICENSE.txt) project to enable cultural heritage institutions to present their digital artifacts in an [IIIF-compliant](http://iiif.io/) and highly customisable user interface. 

Features:

- [OpenSeadragon](https://openseadragon.github.io/) image zooming using the [IIIF image API](http://iiif.io/api/image/2.0/).
- YouTube-style embedding with deep links to specific pages/zoom regions.
- [Themable](https://universalviewer.gitbooks.io/custom-themes/content/), fork the [UV theme](https://github.com/UniversalViewer/uv-en-GB-theme) on github to create your own.
- Highly [configurable](https://github.com/UniversalViewer/universalviewer/wiki/Configuration) and [extensible](http://universalviewer.gitbooks.io/custom-extensions/content/).
- Supports "IxIF" out of the box, allowing [3D](http://universalviewer.io/examples/?manifest=http://files.universalviewer.io/manifests/nelis/ecorche.json), [audio](http://universalviewer.io/examples/?manifest=http://wellcomelibrary.org/iiif/b17307922/manifest), [video](http://universalviewer.io/examples/?manifest=http://wellcomelibrary.org/iiif/b16659090/manifest), and [pdf](http://universalviewer.io/examples/?manifest=http://wellcomelibrary.org/iiif/b17502792/manifest) viewing experiences.
- Supports search and autocomplete service integration with overlayed search results.
- Internationalised UI using [transifex.com](https://www.transifex.com/) (currently supports English and Welsh. Volunteers for more translations gratefully accepted!)

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
 
    bower install uv --save
    
which will download the distribution folder to `bower_components`.

See https://github.com/UniversalViewer/demo-site for examples.

### Examples

To view the examples run:

    grunt
    grunt examples

## License

The Universal Viewer is released under the [MIT license](https://github.com/UniversalViewer/universalviewer/blob/master/LICENSE.txt).

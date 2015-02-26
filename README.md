# Universal Viewer

Navigate sequences of images in a zoomable, extensible interface.

[example](http://universalviewer.azurewebsites.net/)

[Google group](https://groups.google.com/forum/#!forum/universalviewer)

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

## Notes

### Submodules

When switching between branches, the super project may have a different commit hash stored for any or all of the submodules (examples, tests, src/themes/uv-default-theme).

This will show as "new commits" when doing a `git status`.

To reset the submodules to their correct commit hash for the current branch use:

	git submodule update --init

Be aware that this will leave your submodules in a "detached HEAD state" as after the initial clone. Git only deals in commit hashes for submodules, you need to check out the appropriate branch yourself.
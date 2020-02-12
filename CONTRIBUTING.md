# Contribution guide

### Installing dependencies

Before you can build the UV, we assume the following list of software is already installed in your system

- Git
- Node 8 or higher
- Npm 6.0 or higher

### Fork repository

In order to contribute to the UV, you must have a github account so you can push code and create a new Pull Request (PR).

Once you are all setup, following the Github's guide of how to fork a repository: https://guides.github.com/activities/forking/

All command-line operations for building the UV are scripted using [Grunt](http://gruntjs.com/) which is based on [Node.js](http://nodejs.org/). To get set up:

1. Install [Node.js](http://nodejs.org), if you haven't already

1. Install the grunt command line interface:

    `npm install -g grunt-cli`

1. Clone the `universalviewer` repository and `examples` sub module:

    `git clone https://github.com/UniversalViewer/universalviewer.git --recursive`

1. On the command line, go in to the `universalviewer` folder

  `cd universalviewer`

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

#### 2. Open `universalviewer` folder in your IDE

UV source code lives inside the `/src/` folder.

Here is a [diagram](https://docs.google.com/drawings/d/1i484Jd32FoLwtE5uvkBA6l5LV-DioSOZDIWD0WfhWl8/edit?usp=sharing) showing the overall architecture of the project.

The UV aims to be "framework agnostic", as it needs to be used in a variety of contexts. Therefore it is written in "plain" TypeScript and doesn't use a framework such as React or AngularJS. However, [StencilJS](https://stenciljs.com) is now being used to develop parts of the UV as generic Web Components, e.g. https://github.com/UniversalViewer/uv-ebook-components

#### 3. Run test suite

Before commiting your changes make sure tests are passing:

```
npm test
```

 > Note: the development server must be running (`grunt examples`)

 > Tests are written using [Jest](https://jestjs.io/)


#### 4. Create a branch and commit

```bash
# Create a git branch
git checkout -b my-improvement

# Add changes
git add .

# Create commit
git commit -m "fix(component): message"
```

Create a PR:
https://guides.github.com/activities/forking/
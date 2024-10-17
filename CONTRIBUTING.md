# Contribution guide

### Installing dependencies

Before you can build the UV, we assume the following list of software is already installed in your system

- Git
- Node 14.18.1 or higher
- Npm 8.1.1 or higher

### Fork repository

In order to contribute to the UV, you must have a github account so you can push code and create a new Pull Request (PR).

Once you are all setup, following the Github's guide of how to fork a repository: https://guides.github.com/activities/forking/

1. Clone the `universalviewer` repository:

   `git clone https://github.com/UniversalViewer/universalviewer.git`

1. On the command line, go in to the `universalviewer` folder

`cd universalviewer`

1. Run

   `npm install`

## Running the examples on localhost

To build the debug version of the viewer, just run (on the command line, in the `universalviewer` folder):

    npm start

This will compile the project using webpack and serve the examples on `localhost:8080`

## Distribution Builds

To build the distribution version of the UV, just run (on the command line, in the `universalviewer` folder):

    npm run build

#### 2. Open `universalviewer` folder in your IDE

UV source code lives inside the `/src/` folder.

Here is a [diagram](https://docs.google.com/drawings/d/1i484Jd32FoLwtE5uvkBA6l5LV-DioSOZDIWD0WfhWl8/edit?usp=sharing) showing the overall architecture of the project.

#### 3. Run test suite

Before commiting your changes make sure tests are passing:

```
npm test
```

> Note: the development server must be running (`npm start`)

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

#### 5. Create a release

<!-- ```bash
git commit -m "Release v1.2.3"
git tag v1.2.3
git push origin main v1.2.3
``` -->

Checkout the `main` branch, and ensure it is up-to-date.

Run `npm version [major | minor | patch]` for example:

```bash
npm version patch
```

This will update the `package.json` version and create a git tag. Then push both the main/tag.

```bash
git push origin main v0.0.8
```

Then the GitHub action will pick up the tag and publish it to NPM.

Create a PR:
https://guides.github.com/activities/forking/

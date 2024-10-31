# Contribution guide

## Installing dependencies

Before you can build the UV, we assume the following list of software is already installed in your system

- Git
- Node 18 or higher
- Npm 8.1.1 or higher

## Forking the repository

In order to contribute to the UV, you must have a GitHub account so you can push code and create a new Pull Request (PR).

Once you are all setup, following the GitHub's guide of how to fork a repository: https://guides.github.com/activities/forking/

1. Clone the `universalviewer` repository (or your fork):

   `git clone https://github.com/UniversalViewer/universalviewer.git`

1. On the command line, navigate to the `universalviewer` folder:

   `cd universalviewer`

1. To install dependencies, run:

   `npm install`

## Running the examples on localhost

To build the debug version of the viewer, just run (on the command line, in the `universalviewer` folder):

    npm start

This will compile the project using webpack and serve the examples on `localhost:8080`

## Building for distribution

To build the distribution version of the UV, just run (on the command line, in the `universalviewer` folder):

    npm run build

When this process completes, your build can be found in the `dist` folder under your `universalviewer` folder.

## Code Architecture

UV source code lives inside the `/src/` folder.

Here is a [diagram](https://docs.google.com/drawings/d/1i484Jd32FoLwtE5uvkBA6l5LV-DioSOZDIWD0WfhWl8/edit?usp=sharing) showing the overall architecture of the project.

## Running the test suite

Before commiting your changes make sure tests are passing:

```
npm test
```

> Note: the development server must be running (`npm start`)

> Tests are written using [Jest](https://jestjs.io/)

## Project branch strategy

This project follows the [Gitflow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). To summarize:

- Every feature should be developed in its own branch.
- Completed features should be merged into the dev branch, which represents the bleeding edge of stable development.
- When a release is made, the dev branch is merged into the main branch. Main represents the most recent release of the project.

Please target the dev branch when opening pull requests against the project.

### Creating a branch and committing

After making your changes to the code in the dev branch, you can...

```bash
# Create a git branch
git checkout -b feature/my-improvement

# Add changes
git add .

# Create commit
git commit -m "fix(component): message"
```

After pushing your new branch to your fork, you can create a PR; see: https://guides.github.com/activities/forking/

## Creating a release

The decision to make a new release should be made by the Universal Viewer Steering Group. Once a release is planned, the appropriate commit from the dev branch should be merged into the main branch.

Next, checkout the `main` branch, and ensure it is up-to-date.

Run `npm version [major | minor | patch]` to apply an appropriate [semantic versioning](https://semver.org/) update; for example:

```bash
npm version patch
```

This will update the `package.json` version and create a git tag. Then push both the main/tag.

```bash
git push origin main v0.0.8
```

Then the GitHub action will pick up the tag and publish it to NPM.

Finally, merge the `main` branch back to the `dev` branch to synchronize the version numbers.

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

The project also makes use of `release-X.Y` branches to track previous lines of development; see the release process below for more details.

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

### Release Candidate Process

Before a release can be made, some planning and testing are required:

1. The [Universal Viewer Steering Group](https://github.com/UniversalViewer/universalviewer/wiki/Steering-Group) is responsible for determining when a new release is needed (for example, because a sprint has completed, or because a major fix or feature has been contributed). The community is welcome to reach out to members of the Steering Group to propose/request a release at any time.
2. Once a release is decided upon, its version number must be determined. The project uses [semantic versioning](https://semver.org/), so given version X.Y.Z, we will increment Z for fixes (patch release), Y for new features (minor release), or X for backward-incompatible changes (major release).
3. If outstanding work must be completed to ensure a stable release, a milestone for the new version will be created in GitHub and all relevant outstanding issues/PRs assigned to it, so that estimation can be performed to set a realistic release date (this could be done at steering group and/or community call meetings). If work is already complete, the release can proceed immediately.
4. When it's time to begin the release process, a pull request should be created against the `dev` branch containing the result of running the `npm version X.Y.Z-rc1` command (where X.Y.Z is replaced with the new version determined in step 2). This will create a release candidate that can be easily tested online and/or locally built. The description of this pull request should highlight major changes and areas where testing is needed.
5. Once the release candidate is built, the Steering Group will announce it and offer an appropriate testing window (usually 1-2 weeks, depending on scope/complexity of changes) for community feedback. During this window, community members are encouraged to build the new version, try it out in their environments, and raise issues/pull requests if they encounter problems.
6. When the testing window ends, the pull request from step 4 will be merged.
7. If problems were found during the testing window, they will be evaluated by the Steering Group, and as soon as any critical bugs are fixed, steps 4-6 will be repeated with an incremented "rc" number (e.g. X.Y.Z-rc2) to ensure that no problems remain.
8. Once the release candidate is deemed stable by the Steering Group, it will be promoted to the formal release. After the RC pull request is merged, the full release can be published.

### Making a Normal Release

Once a stable release is ready to be published, these steps can be followed:

1. On the `dev` branch, run `npm version X.Y.Z` (replacing "X.Y.Z" with the actual number of the new version) to appropriately update `package.json` and create a git tag.
2. If the new release will be a major or minor version (but NOT if it will be a patch release), a new `release-X.Y` branch needs to be created from the `main` branch before anything is merged. This release branch will make it easier to backport fixes to earlier versions if critical bugs or security issues are discovered later. For example, if the current version is 4.0.25 and 4.1.0 is about to be released, a new `release-4.0` branch would be created from the `main` branch to continue tracking the development of the 4.0.x line of code.
3. Whether or not a release branch needed to be created, it is now time to merge the `dev` branch into the `main` branch to ensure that `main` always represents the most recently released version.
4. All changed branches and newly-created release tags must be pushed to GitHub; e.g. `git push origin main dev v4.1.0 release-4.0` (for a new major release) or `git push origin main dev v4.1.1` (for a new minor release).
5. At this point, a GitHub action will recognize the new version tag and publish the package to NPM.

### Backporting a Bug Fix

If there is a need to fix a bug in an older version of the code, bug fix pull requests should be created against the appropriate `release-X.Y` branch(es). After these are merged and tested, releases can be published from the appropriate release branch(es) by running `npm version patch` and then pushing the updated files and new release tag to GitHub. There should be no need to merge from `release-X.Y` branches forward to the `dev` branch when fixes are backported.

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

For more in-depth information on the application structure please see the [manual](https://github.com/UniversalViewer/universalviewer/blob/dev/manual/index.md).

## Running the test suite

Before commiting your changes make sure tests are passing:

```
npm test
```

> Note: the test suite runs its own server on port 4444 for browser-based testing; be sure that you have built the latest code (e.g. using `npm run build`) before running tests to ensure that you are testing the right changes.

> Tests are written using [Jest](https://jestjs.io/)

## Project branch strategy

This project's branch strategy is based on the [Gitflow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). To summarize:

- Every feature should be developed in its own branch.
- Completed features should be merged into the `dev` branch, which represents the bleeding edge of stable development.
- While a release is in testing, a short-lived `release-X.Y.Z` branch is created to isolate fixes from new feature development.
- When a release is completed, the `release-X.Y.Z` branch is merged into `dev` and the corresponding `release-X.Y` branch, then the `dev` branch is merged into the `main` branch, which represents the most recent stable release of the project.
- Long-lived `release-X.Y` branches are retained to allow backporting of fixes.

See the release process below for more details.

Please target the `dev` branch when opening pull requests against the project, except when contributing a bug fix to an active `release-X.Y.Z` branch.

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

### Pre-Release Planning

Before a release can be made, some planning is required:

1. The [Universal Viewer Steering Group](https://github.com/UniversalViewer/universalviewer/wiki/Steering-Group) is responsible for determining when a new release is needed (for example, because a sprint has completed, or because a major fix or feature has been contributed) and for identifying a Release Manager (any Steering Group member with rights to bypass GitHub branch protection rules) to manage the technical parts of the process. The community is welcome to reach out to members of the Steering Group to propose/request a release at any time.
2. Once a release is decided upon, its version number must be determined. The project uses [semantic versioning](https://semver.org/), so given version X.Y.Z, we will increment Z for fixes (patch release), Y for new features (minor release), or X for backward-incompatible changes (major release).
3. If outstanding work must be completed to ensure a stable release, a milestone for the new version will be created in GitHub and all relevant outstanding issues/PRs assigned to it, so that estimation can be performed to set a realistic release date (this could be done at steering group and/or community call meetings). If work is already complete, the release candidate process can begin immediately.

### Release Candidate Process

A series of Release Candidates should be created and tested to ensure that the final release is stable. Note that the examples in the steps below assume that Git is set up with an `upstream` remote pointing at the main Universal Viewer repository and an `origin` remote pointing at the Release Manager's fork. Replace X.Y.Z in all steps with the version determined in step 2 of Pre-Release Planning.

1. When it's time to begin the release process, the Release Manager will create a `release-X.Y.Z` branch off of `dev`: `git checkout dev ; git checkout -b release-X.Y.Z ; git push --set-upstream upstream release-X.Y.Z`
2. The Release Manager should create a new branch for the release candidate: `git checkout -b release-X.Y.Z-rc1`.
3. The Release Manager should use NPM to bump the version: `npm version X.Y.Z-rc1`.
4. The Release manager should ensure that auto-generated documentation is up to date by running `npm run docs` and committing changes, if any.
5. The Release Manager should push the new RC branch up to their personal repo: `git push --set-upstream origin release-X.Y.Z-rc1`.
6. The Release Manager should next create a pull request to merge `release-X.Y.Z-rc1` into the new `release-X.Y.Z` branch. When creating the PR on GitHub, be sure to target the appropriate release branch, not `dev`. This PR can be merged immediately; its purpose is to create an easily accessible public preview and a public forum for discussion of the RC. The description of this pull request should highlight major changes and areas where testing is needed; you can use the GitHub compare tool to review commits -- e.g. `https://github.com/UniversalViewer/universalviewer/compare/main...release-X.Y.Z` will show all commits added between the last stable release and the new release-in-progress.
7. The release tag created during step 3 should be pushed to the main GitHub repository to trigger publishing of the release candidate to NPM: `git push upstream vX.Y.Z-rc1`
8. Next, the Steering Group will announce the release candidate and offer an appropriate testing window (usually 1-2 weeks, depending on scope/complexity of changes) for community feedback. During this window, community members are encouraged to build the new version, try it out in their environments, and raise issues/pull requests if they encounter problems.
9. If problems were found during the testing window, they will be evaluated by the Steering Group, and as soon as any critical bugs are fixed, steps 2-8 will be repeated with an incremented "rc" number (e.g. X.Y.Z-rc2) to ensure that no problems remain.
10. Once the release candidate is deemed stable by the Steering Group, it will be promoted to the formal release. After the RC pull request is merged, the full release can be published.

### Making a Normal Release

Once a stable release is ready to be published, these steps can be followed by the Release Manager:

1. On the `release-X.Y.Z` branch, run `npm version X.Y.Z` (replacing "X.Y.Z" with the actual number of the new version) to appropriately update `package.json` and create a Git tag.
2. Merge the `release-X.Y.Z` branch into both `dev` and the matching `release-X.Y` branch. Create the `release-X.Y` branch if it does not already exist. The `release-X.Y` branch will be long-lived, used to create backported patch releases as needed; the `release-X.Y.Z` branch will be deleted as part of the release process, as it is no longer needed.
3. Merge the `release-X.Y` branch into the `main` branch, so that `main` continues to point to the most recent stable release.
4. All changed/deleted branches and newly-created release tags must be pushed to GitHub; e.g. `git push origin main dev v4.1.0 release-4.1 :release-4.1.0`. (Note the colon on `:release-4.1.0` -- this deletes the short-lived release branch while updating all of the long-lived branches).
5. At this point, a GitHub action will recognize the new version tag and publish the package to NPM.
6. Don't forget to create a release with appropriate release notes through the GitHub web interface to make the new version more visible.

### Backporting a Bug Fix

If there is a need to fix a bug in an older version of the code, bug fix pull requests should be created against the appropriate `release-X.Y` branch(es). After these are merged and tested, releases can be published from the appropriate release branch(es) by running `npm version patch` and then pushing the updated files and new release tag to GitHub. There should be no need to merge from `release-X.Y` branches forward to the `dev` branch when fixes are backported.

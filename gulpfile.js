const gulp = require('gulp');
const metadata = require('./package');
const tasks = require('gulp-tasks');

tasks.init({
    metadata: metadata,
    // libs that MUST be included in a consuming app for this component to work
    libs: [
        'node_modules/base-component/dist/base-component.bundle.js'
    ],
    // libs that MAY be included in a consuming app but are used here for example purposes
    examples: []
});
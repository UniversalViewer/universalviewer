const assert = require('assert');
const expect = require('chai').expect;
const selenium = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const manifests = require('./manifests');
const shared = require('./shared');

const driver = new selenium.Builder()
.withCapabilities( { 'browserName' : 'chrome' } )
.build();

test.before(function() {
    shared(driver);
});

test.after(function() {
    driver.quit();
});

test.describe('Universal Viewer', function() {

    test.it('has the correct page title', function() {

        this.timeout('10000');

        loadManifest(manifests.wunderDerVererbung);

        driver.getTitle().then(function(title) {
            expect(title).equals('Universal Viewer Examples');
        });

        driver.sleep();
    });

});
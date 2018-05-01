describe('Configuration options', () => {
  describe('thumb cache invaldiation', () => {
    beforeEach(async () => {
      await page.goto('http://localhost:4444/examples');
      await page.waitForSelector('#thumb0');
    });
    it.skip('when set to false does not provide timestamp', async () => {
      await page.evaluate(() => uv.set(
        { config: { modules: { contentLeftPanel: { options: { thumbsCacheInvalidation: { enabled: false }}}}}}
      ));
      await page.waitForSelector('#thumb0');
      const imageSrc = await page.$eval('#thumb0 img', e => e.src);
      expect(imageSrc).toEqual( 
        expect.stringMatching(
          'https://dlcs.io/iiif-img/wellcome/1/ff2085d5-a9c7-412e-9dbe-dda87712228d/full/90,/0/default.jpg'
        )
      );
    });
    it.skip('has a configurable parameter type', async () => {
      await page.evaluate(() => uv.set(
        { config: { modules: { contentLeftPanel: { options: { thumbsCacheInvalidation: { paramType: '#' }}}}}}
      ));
      await page.waitForSelector('#thumb0');
      const imageSrc = await page.$eval('#thumb0 img', e => e.src);
      expect(imageSrc).toEqual( 
        expect.stringContaining(
          'https://dlcs.io/iiif-img/wellcome/1/ff2085d5-a9c7-412e-9dbe-dda87712228d/full/90,/0/default.jpg#t='
        )
      );
    });
  });
});

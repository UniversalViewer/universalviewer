test.skip('Configuration options')

describe('Universal Viewer', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:4444/examples');
  });
  it('has the correct page title', async () => {
    const title = await page.title();
    expect(title).toBe('Universal Viewer Examples');
  });
  it('loads the viewer images', async () => {
    await page.waitForSelector('#thumb0');
    const imageSrc = await page.$eval('#thumb0 img', e => e.src);
    expect(imageSrc).toEqual(
      expect.stringContaining(
        'https://dlcs.io/iiif-img/wellcome/1/ff2085d5-a9c7-412e-9dbe-dda87712228d/full/90,/0/default.jpg?t='
      )
    );
  });
});

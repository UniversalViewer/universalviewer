test.skip('Configuration options', () => {});

describe('Universal Viewer', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:4444/');
  });
  it('has the correct page title', async () => {
    const title = await page.title();
    expect(title).toBe('Universal Viewer Examples');
  });
  it('loads the viewer images', async () => {
    await page.waitForSelector('#thumb-0');
    const imageSrc = await page.$eval('#thumb-0 img', e => e.src);
    expect(imageSrc).toEqual(
      expect.stringContaining(
        'https://iiif.wellcomecollection.org/image/b18035723_0001.JP2/full/90,/0/default.jpg'
      )
    );
  });
});

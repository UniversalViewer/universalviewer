test.skip('Configuration options', () => {});

const puppeteer = require('puppeteer');

describe('Universal Viewer', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:8080/#?xywh=-1741%2C125%2C8017%2C6807&iiifManifestId=http%3A%2F%2Fiiif.bodleian.ox.ac.uk%2Fexamples%2Fmushaf4.json');
  });

  afterAll(async () => {
    await browser.close();
  });

  it('has the correct page title', async () => {
    const title = await page.title();
    expect(title).toBe('Universal Viewer Examples');
  });

  it('extends thumbnail labels when "extend labels" checkbox is clicked', async () => {
    
    jest.setTimeout(10000);


    await page.waitForSelector('.btn.imageBtn.settings .uv-icon-settings');
    await page.click('.btn.imageBtn.settings .uv-icon-settings');

   
    await page.waitForSelector('.setting.extendThumbnailLabels');

   
    await page.click('#extendThumbnailLabels');

    
    await page.waitForSelector('.thumb.extend-labels');

    
    const labelContainerStyle = await page.evaluate(() => {
        const firstThumbnailLabelContainer = document.querySelector('.thumb.extend-labels .info .label');
        return window.getComputedStyle(firstThumbnailLabelContainer).getPropertyValue('white-space');
    });

    
    expect(labelContainerStyle).toBe('break-spaces');
});

it('settings button is visible', async () => {
  
  await page.waitForSelector('.btn.imageBtn.settings');
  
 
  const isSettingsButtonVisible = await page.evaluate(() => {
    const settingsButton = document.querySelector('.btn.imageBtn.settings');
    const style = window.getComputedStyle(settingsButton);
    return style.getPropertyValue('visibility') !== 'hidden' && style.getPropertyValue('display') !== 'none';
  });

  expect(isSettingsButtonVisible).toBe(true);
});
});

//   it('loads the viewer images', async () => {
//     await page.waitForSelector('#thumb0');
//     const imageSrc = await page.$eval('#thumb0 img', e => e.src);
//     expect(imageSrc).toEqual(
//       expect.stringContaining(
//         'https://iiif.wellcomecollection.org/image/b18035723_0001.JP2/full/90,/0/default.jpg?t=1620404278998'
//       )
//     );
//   });


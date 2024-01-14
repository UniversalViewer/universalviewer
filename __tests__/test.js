test.skip('Configuration options', () => {});

describe('Universal Viewer', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080/#?xywh=-1741%2C125%2C8017%2C6807&iiifManifestId=http%3A%2F%2Fiiif.bodleian.ox.ac.uk%2Fexamples%2Fmushaf4.json');
  });

  it('has the correct page title', async () => {
    const title = await page.title();
    expect(title).toBe('Universal Viewer Examples');
  });

  it('shows checkbox when label overflows', async () => {
    
    await page.waitForSelector('#extendLabelsCheckbox', { timeout: 15000 }); 
  
    const checkbox = await page.$('#extendLabelsCheckbox');
    expect(checkbox).not.toBe(null);
  
    const isChecked = await page.$eval('#extendLabelsCheckbox', (el) => el.checked);
    expect(isChecked).toBe(false);
    
    await page.waitForSelector('#extendLabelsCheckbox', { visible: true, timeout: 15000 }); 
   
    const visibleCheckbox = await page.$('#extendLabelsCheckbox');
    expect(visibleCheckbox).not.toBe(null);
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


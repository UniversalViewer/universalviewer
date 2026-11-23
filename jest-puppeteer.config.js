module.exports = {
  launch: {
    headless: process.env.CI === 'true',
    args: [`--window-size=1920,1080`],
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  },
  setupFilesAfterEnv: [
    './jest.setup.js'
  ]
}

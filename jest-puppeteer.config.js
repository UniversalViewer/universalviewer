module.exports = {
  launch: {
    headless: process.env.CI === 'true',
    args: [`--window-size=1920,1080`],
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  },
  server: {
    command: 'npm run e2eserve',
    port: 4444,
  },
  setupFilesAfterEnv: [
    './jest.setup.js'
  ]
}

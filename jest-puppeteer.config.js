module.exports = {
  launch: {
    headless: process.env.CI === 'true',
  },
  server: {
    command: 'npm run e2eserve',
    port: 4444,
  },
  setupFilesAfterEnv: [
    './jest.setup.js'
  ]
}

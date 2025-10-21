const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'yq8uc3',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    reporter: "junit"
  },
});
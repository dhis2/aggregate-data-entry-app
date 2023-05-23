const {
    networkShim,
    chromeAllowXSiteCookies,
    cucumberPreprocessor,
} = require('@dhis2/cypress-plugins')
const { defineConfig } = require('cypress')

// This function will be modified when we add plugins
async function setupNodeEvents(on, config) {
    await cucumberPreprocessor(on, config)
    networkShim(on, config)
    chromeAllowXSiteCookies(on, config)
    return config
}

module.exports = defineConfig({
    video: false,
    projectId: 's6p5xs',
    experimentalInteractiveRunEvents: true,
    defaultCommandTimeout: 30000,
    e2e: {
        setupNodeEvents,
        baseUrl: 'http://localhost:3000',
        specPattern: 'cypress/e2e/**/*.feature',
    },
    env: {
        dhis2DataTestPrefix: 'dhis2-dataentry',
        networkMode: 'live',
        dhis2ApiVersion: '40',
    },
})

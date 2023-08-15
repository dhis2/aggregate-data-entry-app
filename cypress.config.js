const {
    networkShim,
    chromeAllowXSiteCookies,
    cucumberPreprocessor,
} = require('@dhis2/cypress-plugins')
const registerReportPortalPlugin = require('@reportportal/agent-js-cypress/lib/plugin')
const { defineConfig } = require('cypress')

// This function will be modified when we add plugins
async function setupNodeEvents(on, config) {
    await cucumberPreprocessor(on, config)
    networkShim(on, config)
    chromeAllowXSiteCookies(on, config)
    registerReportPortalPlugin(on, config)
    return config
}

module.exports = defineConfig({
    video: false,
    projectId: 's6p5xs',
    experimentalInteractiveRunEvents: true,
    defaultCommandTimeout: 30000,
    reporter: '@reportportal/agent-js-cypress',
    reporterOptions: {
        endpoint: process.env.REPORTPORTAL_ENDPOINT,
        apiKey: process.env.REPORTPORTAL_API_KEY,
        launch: 'aggregate_data_entry_app_master',
        project: process.env.REPORTPORTAL_PROJECT,
        description: '',
        autoMerge: true,
        parallel: true,
        debug: false,
        restClientConfig: {
            timeout: 360000,
        },
        attributes: [
            {
                key: 'version',
                value: 'master',
            },
            {
                key: 'app_name',
                value: 'aggregate_data_entry_app',
            },
            {
                key: 'test_level',
                value: 'e2e',
            },
        ],
    },
    e2e: {
        setupNodeEvents,
        baseUrl: 'http://localhost:3000',
        specPattern: 'cypress/e2e/**/*.feature',
    },
    env: {
        dhis2DataTestPrefix: 'dhis2-dataentry',
        networkMode: 'live',
        dhis2ApiVersion: '41',
    },
})

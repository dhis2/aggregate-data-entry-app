const reportPortalConfig = [
    '@reportportal/agent-js-jest',
    {
        apiKey: process.env.REPORTPORTAL_API_KEY,
        endpoint: process.env.REPORTPORTAL_ENDPOINT,
        project: process.env.REPORTPORTAL_PROJECT,
        launch: 'aggregate_data_entry_app_master',
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
                value: 'unit/integration',
            },
        ],
        description: '',
        debug: true,
    },
]

const isReportPortalSetup =
    process.env.REPORTPORTAL_API_KEY !== undefined &&
    process.env.REPORTPORTAL_ENDPOINT !== undefined &&
    process.env.REPORTPORTAL_PROJECT !== undefined

module.exports = {
    setupFilesAfterEnv: ['<rootDir>/src/test-utils/setup-tests.js'],
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/src/locales/',
        '/src/test-utils/',
    ],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
    },
    testRunner: 'jest-circus/runner',
    reporters: [
        'default',
        ...(isReportPortalSetup ? [reportPortalConfig] : []),
    ],
}

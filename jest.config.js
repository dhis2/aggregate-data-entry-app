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
        [
            '@reportportal/agent-js-jest',
            {
                apiKey: process.env.REPORTPORTAL_API_KEY,
                endpoint: 'https://test.tools.dhis2.org/reportportal/api/v1',
                project: 'dhis2_auto',
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
        ],
    ],
}

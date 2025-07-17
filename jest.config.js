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
    transformIgnorePatterns: ['/node_modules/@tanstack/react-query-devtools'],
}

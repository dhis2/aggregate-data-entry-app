const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact, 'plugin:cypress/recommended'],
    // TODO: remove this rule when styled-jsx is removed from the app
    // https://dhis2.atlassian.net/browse/DHIS2-14514
    rules: { 'react/no-unknown-property': ['error', { ignore: ['jsx'] }] },
}

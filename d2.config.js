/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    name: 'aggregate-data-entry-custom-forms',
    type: 'app',
    title: 'Data Entry (Legacy Custom Forms beta)',
    minDHIS2Version: '2.39',
    coreApp: false,
    pwa: {
        enabled: true,
        caching: {
            patternsToOmitFromAppShell: [
                /\/api.*\/dataEntry\/dataValues/,
                /\/api.*\/dataEntryForms/,
            ],
            // // // ToDo: discuss whether these omits are necessary - seemed to not work without them on production build
            // globsToOmitFromPrecache: [
            //     'plugin.html',
            //     'plugin*.js'
            // ]
        },
    },
    entryPoints: {
        app: './src/app/app-wrapper.jsx',
        plugin: './src/plugin-legacy-custom-forms/index.jsx',
    },
    direction: 'auto',
}

module.exports = config

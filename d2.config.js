/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    id: '4a5b87dc-015c-47db-ae77-f2f42e3bbb5a',
    name: 'aggregate-data-entry',
    type: 'app',
    title: 'Data Entry',
    minDHIS2Version: '2.39',
    coreApp: true,
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

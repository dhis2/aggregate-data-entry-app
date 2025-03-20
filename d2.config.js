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
        },
    },
    entryPoints: {
        app: './src/app/app-wrapper.jsx',
    },
    direction: 'auto',
}

module.exports = config

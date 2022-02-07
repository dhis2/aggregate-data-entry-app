const config = {
    type: 'app',
    title: 'Data Entry',
    pwa: {
        enabled: true,
        caching: {
            patternsToOmitFromAppShell: [
                'dataSets',
                'dataValueSets',
                'metadata',
                'organisationUnits',
            ],
        },
    },
    entryPoints: {
        app: './src/app/app.js',
    },
}

module.exports = config

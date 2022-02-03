const config = {
    type: 'app',
    title: 'Data Entry',
    pwa: {
        enabled: true,
        caching: {
            patternsToOmitFromAppShell: ['dataValueSets'],
        },
    },
    entryPoints: {
        app: './src/app/app.js',
    },
}

module.exports = config

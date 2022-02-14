const config = {
    type: 'app',
    title: 'Data Entry',
    pwa: {
        enabled: process.env.REACT_APP_NODE_ENV !== 'test',
        caching: {
            patternsToOmitFromAppShell: ['dataValueSets'],
        },
    },
    entryPoints: {
        app: './src/app/app.js',
    },
}

module.exports = config

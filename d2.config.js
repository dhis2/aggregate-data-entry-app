const config = {
    name: 'data-entry',
    type: 'app',
    title: 'Data Entry (Beta)',
    pwa: {
        // Need this for offline testing. Can disable in other branches if desired
        enabled: true,
        caching: {
            patternsToOmitFromAppShell: [
                /\/api.*\/dataEntry\/dataValues/,
                /\/api.*\/dataEntryForms/,
            ],
        },
    },
    entryPoints: {
        app: './src/app/app-wrapper.js',
    },
}

module.exports = config

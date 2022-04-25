const config = {
    type: 'app',
    title: 'Data Entry',
    pwa: {
        enabled: process.env.REACT_APP_NODE_ENV !== 'test',
    },
    entryPoints: {
        app: './src/app/app-wrapper.js',
    },
}

module.exports = config

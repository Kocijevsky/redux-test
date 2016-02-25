var path = require('path');
module.exports = {
    entry: {
        main:"./counter.js",
        second:"./index2.js"
    },
    output: {
        path: path.join(__dirname, "js"),
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    devtool:'source-map'
};
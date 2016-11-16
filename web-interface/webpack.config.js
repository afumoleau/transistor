module.exports = {
    entry: "./src/main.js",
    output: {
        path: "dist",
        filename: "app.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};
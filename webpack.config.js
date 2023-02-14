export default {
    entry: {
        canvas: "./src/test/canvas.ts"
    },
    output: {
        filename: "[name].js"
    },
    resolve: {
        extensions: [".ts", ".tsx"],
        extensionAlias: {
            ".js": [".ts", ".js"]
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    devServer: {

    },
    mode: "development"
}
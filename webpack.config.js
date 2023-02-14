import HtmlWebpackPlugin from "html-webpack-plugin"

export default {
    entry: {
        view: "./src/test/view.ts"
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
    plugins: [
        new HtmlWebpackPlugin({
            filename: "[name].html"
        })
    ]
}
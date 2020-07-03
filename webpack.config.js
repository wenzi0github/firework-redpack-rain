const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const packageConfig = require("./package");

// https://webpack.docschina.org/configuration
module.exports = {
    mode: "production",
    entry: {
        index: "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        libraryExport: "default",
        library: "User",
        libraryTarget: "umd",
        globalObject: "this",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin(
            `User v${
                packageConfig.version
            }\nlast update: ${new Date().toLocaleString()}\nauthor: skeetershi`
        ),
    ],
};
